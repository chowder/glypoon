"""Definitions for answer words, taken from the COED dump.

A word can have several meanings in COED, and RULES.md may make only some of
them count: "times" is valid as a verb (to multiply), not as the plural of
"time"; "saw" as a noun, not as the past of "see". So the definition shown for
an answer is the first sense that is valid on its own under the same rules
build_corpus.py uses to accept the word:

- Lines with no part of speech of their own are skipped. These are index
  entries pointing at another headword ("past of see", "plural of time").
- Parts of speech that never make a word valid (abbreviation, prefix, ...)
  are skipped.
- Senses that are only a form of another word ("[compar. of good]",
  "superlative of bad") are skipped, as are -ly adverb sections and the
  adjective/adverb senses of irregular comparatives and superlatives.
- Top-level senses are preferred over ones restricted to a set phrase
  ("(given to) inclined or disposed to"), and senses COED labels offensive,
  derogatory or vulgar come last. So do senses that only apply to a
  capitalized form ("(Apostle) each of the twelve ..."), since RULES.md needs
  the word listed without a capital.

A sense that only points at another word ("another term for alley",
"variant spelling of emir") is replaced by that word's definition.

Usage:
  python coed_definitions.py WORD [WORD ...]
"""

import html
import re
import sys
from typing import NamedTuple, Optional

from build_corpus import EXTRA_WORDS, NON_WORD_POS, read_dump

# RULES.md disallows irregular comparatives and superlatives as forms of
# adjectives, but COED gives some of them adjective senses without saying
# "comparative of" (e.g. "worst: adjective of the poorest quality"). Words
# like "worst" are valid through their other parts of speech ("verb get the
# better of"), so those are shown in preference.
IRREGULAR_COMPARATIVES = {
    "better", "best", "worse", "worst", "less", "least", "lesser",
    "more", "most", "further", "furthest", "farther", "farthest",
    "elder", "eldest", "former",
}

HOMOGRAPH_SEPARATOR = "————————"
POS_RE = re.compile(r'■ <c c="green">(.*?)</c>(.*)')
# A section heading such as Origin, Phrases, Derivatives or Usage ends the
# senses of the entry above it.
HEADING_RE = re.compile(r'^<blockquote><b><c c="[a-z]+">[A-Z][^<]*</c></b></blockquote>')
SUBSENSE_RE = re.compile(r"^(<blockquote>)*\s*↘")
SENSE_NUMBER_RE = re.compile(r"^(<blockquote>)*\s*(\d+》)?\s*")
# "(given to) inclined to": the sense only applies in that phrase. "(also
# palm tree)" and "(often confide in)" don't restrict the sense.
SET_PHRASE_RE = re.compile(r'^\(\s*<c c="darkslategray">(.*?)</c>\s*\)')
JOIN = r"(\s*(,|or|and|&amp;|&)\s*)"
# Usage labels ("informal", "N. Amer. or Irish & Scottish"), pronunciations,
# and extra parts of speech ("adjective, adverb, & exclamation").
LABELS_RE = re.compile(
    rf'<c c="(slateblue|seagreen|darkcyan)">.*?</c>'
    rf'({JOIN}?<c c="(slateblue|seagreen|darkcyan)">.*?</c>)*'
)
HEAD_TOKEN_RE = re.compile(
    r'\s+|,|;|&amp;|&|or\b|and\b|\[[^\]]*\]|<i>[^<]*</i>|<c c="(slateblue|seagreen|darkcyan)">.*?</c>'
)
FORM_WORDS = r"(past|present|plural|tense|participle|person|singular|second|third|form|and|or)"
FORM_OF_RE = re.compile(
    rf"^((archaic|literary|dialect|nonstandard|informal) )?"
    rf"(past|present|plural|comparative|superlative|second|third)( {FORM_WORDS})* of\b"
    r"|\b(compar|superl)\. of\b"
    r"|\b(comparative|superlative) of\b",
    re.I,
)
# "another term for alley 1 (in sense 1)", "US spelling of mould 1, mould 2",
# "short for examination (in sense 2)". Qualifiers before "spelling of" etc.
# are a few words that aren't articles, so "pasta in the form of short wide
# tubes" and "a form of art in which ..." aren't cross-references.
_QUALIFIER = r"(?:(?!(?:a|an|the|in|of)\b)[\w.'-]+ ){0,3}"
CROSS_REF_RE = re.compile(
    rf"^(?:{_QUALIFIER}(?:variant|spelling|form) of"
    rf"|{_QUALIFIER}(?:term|name|word) for(?: the)?"
    r"|short for|=)"
    r"\s+(?P<target>[a-z][a-z'-]*(?: [a-z][a-z'-]*){0,2}?)(?: or [a-z][a-z'-]*)?"
    r"(?:\s+(?P<homograph>\d+))?"
    r"(?:\s*\(in sense (?P<sense>\d+)\))?"
    r"(?:\s*\([^)]*\))?(?:,[^.]*)?\.?$",
    re.I,
)
MAX_CROSS_REFS = 2
SUPERSCRIPT = str.maketrans("0123456789", "⁰¹²³⁴⁵⁶⁷⁸⁹")
LABEL_RE = re.compile(r'<c c="slateblue">(.*?)</c>')
OFFENSIVE_LABEL_RE = re.compile(r"offensive|derogatory|vulgar")


def _plain(raw):
    s = re.sub(r"<[^>]+>", " ", raw)
    return re.sub(r"\s+", " ", html.unescape(s)).strip()


def _clean(raw):
    s = re.sub(r'<c c="gray">.*?</c>(\|<i>[^<]*</i>)*', "", raw)  # example phrases
    s = s.replace("in phr. ", "")  # "(often in phr. on the dole)" -> "(often on the dole)"
    s = LABELS_RE.sub("", s)
    s = re.sub(r"\[[^\]]*\]", "", s)  # grammar notes
    s = re.sub(r"(\d)\s*<sup>(\d+)</sup>", lambda m: m.group(1) + m.group(2).translate(SUPERSCRIPT), s)
    s = _plain(s).replace("↘", "")
    s = re.sub(r"^\d+》", "", s).strip()
    s = re.sub(r"^([,&]|or\b|and\b|\s)+", "", s)
    s = re.sub(r"\(\s*(usu\.|also|often|e\.g\.)?\s*\)", "", s)  # brackets emptied above
    s = re.sub(r"^(\([^)]*\))\s*(or|and|&)\s+", r"\1 ", s)  # "(usu. ablutions) formal or humorous an act"
    s = re.sub(r"\s+([,.;:)])", r"\1", s)
    s = re.sub(r"\(\s+", "(", s)
    s = re.sub(r"(^|(?<=\.))\s*(Compare with|See also)\b[^.]*(\.\s*|$)$", "", s)  # pointers to related words
    s = re.sub(r"[\s:;,]+$", "", s)  # left by a removed example ("... young woman:")
    s = re.sub(r"\s+", " ", s).strip()
    if s and s[-1] not in ".!?":
        s += "."
    return s


class Sense(NamedTuple):
    pos: str
    definition: str
    phrase: bool  # restricted to a set phrase: "(given to) inclined to"
    offensive: bool  # labelled offensive, derogatory or vulgar
    fallback: bool  # an irregular comparative's adjective sense, shown for want of another
    capitalized: bool = False  # only applies to a capitalized form: "(Apostle) ..."
    number: Optional[int] = None  # the sense number in the entry ("2》"), if numbered


def _labels(raw):
    return {html.unescape(l).strip(" ,").lower() for l in LABEL_RE.findall(raw)}


def _strip_head(rest):
    """Split what follows a part of speech into (inline sense, labels, phrase).

    `phrase` is the set phrase the senses belong to, e.g. "(out of kilter)",
    or None.

    Drops what comes before the sense: labels ("informal"), pronunciations,
    extra parts of speech ("adjective, adverb, & exclamation"), and bracketed
    inflections, which may nest: "(plural billions or (with numeral) same)".
    A bracket marked "in phr." means the senses only apply in a set phrase
    ("noun (in phr. in lieu (of)) instead (of)"). Brackets that only qualify
    the sense, like "(of a person) mad", are kept.
    """
    labels, phrase, i = set(), None, 0
    while i < len(rest):
        m = HEAD_TOKEN_RE.match(rest, i)
        if m:
            labels |= _labels(m.group(0))
            i = m.end()
            continue
        if rest[i] != "(":
            break
        depth, j = 0, i
        while j < len(rest):
            depth += {"(": 1, ")": -1}.get(rest[j], 0)
            j += 1
            if depth == 0:
                break
        group = rest[i:j]
        if "in phr." in group:
            inner = _clean(group[1:-1].replace("in phr.", "")).rstrip(".")
            phrase = f"({inner})"
        elif "darkslategray" not in group and "slateblue" not in group:
            break  # "(of a person)": part of the sense
        labels |= _labels(group)
        i = j
    return rest[i:], labels, phrase


def senses(word, raw, allow_irregular_adjectives=False):
    """Valid senses of `word`, in entry order.

    Senses tied to a set phrase, then senses only for a capitalized form,
    then senses labelled offensive, come after the rest.
    """
    found = []
    for block in raw.split(HOMOGRAPH_SEPARATOR):
        pos, section_labels, section_phrase = None, set(), None
        number = None
        for line in block.split("\n"):
            if HEADING_RE.search(line):
                pos = None
                continue
            numbered = re.search(r"(\d+)》", line)
            number = int(numbered.group(1)) if numbered else None
            m = POS_RE.search(line)
            if m:
                pos = re.sub(r"\s*&\s*", " & ", html.unescape(m.group(1))).strip()
                line, section_labels, section_phrase = _strip_head(m.group(2))
            if pos is None:
                continue  # index entry or text outside a part of speech
            parts = [p.strip() for p in pos.split("&")]
            if all(p in NON_WORD_POS for p in parts):
                continue
            if all("adverb" in p for p in parts) and word.endswith("ly"):
                continue
            if (
                not allow_irregular_adjectives
                and word in IRREGULAR_COMPARATIVES
                and all(p in ("adjective", "adverb") for p in parts)
            ):
                continue
            if SUBSENSE_RE.search(line) and "》" not in line:
                continue
            if FORM_OF_RE.search(_plain(SENSE_NUMBER_RE.sub("", line))):
                continue
            definition = _clean(line)
            if len(definition) < 3:
                continue
            if section_phrase:
                definition = f"{section_phrase} {definition}"
            body = SENSE_NUMBER_RE.sub("", line)
            restriction = SET_PHRASE_RE.search(body)
            capitalized = False
            if restriction and re.search(r"[A-Z]", _plain(restriction.group(1))):
                # "(Apostle) each of the twelve ...", "(the Pope) the Bishop of
                # Rome": RULES.md needs the word listed without a capital, so
                # these senses don't make it valid.
                capitalized, restriction = True, None
            labels = section_labels | _labels(line)
            found.append(Sense(
                pos=pos,
                definition=definition,
                phrase=bool(section_phrase) or bool(restriction),
                offensive=any(OFFENSIVE_LABEL_RE.search(l) for l in labels),
                fallback=allow_irregular_adjectives,
                capitalized=capitalized,
                number=number,
            ))
    if not found and not allow_irregular_adjectives and word in IRREGULAR_COMPARATIVES:
        # Adjective only ("lesser", "eldest"): show that rather than nothing.
        return senses(word, raw, allow_irregular_adjectives=True)
    return sorted(found, key=lambda s: (s.offensive, s.capitalized, s.phrase))  # stable


def _without_mentions(definition, word):
    """Drop the other word's pointers back to `word` from a followed definition.

    "collarbone: ... the shoulder blades; the clavicle." -> no "; the clavicle"
    "elk: a large northern deer ... Called moose in North America." -> no last sentence
    "log: (also logbook) an official record ..." -> no "(also logbook)"
    """
    w = re.escape(word)
    s = re.sub(rf";\s*(the |a |an )?{w}\.$", ".", definition, flags=re.I)
    s = re.sub(rf"\s*(Also called|Called|Also known as)\b[^.]*\b{w}\b[^.]*\.$", "", s, flags=re.I)
    s = re.sub(r"^\(also [^)]*\)\s*", "", s)
    return s if s.endswith((".", "!", "?")) else s + "."


class Lookup(NamedTuple):
    pos: str
    definition: str
    sense: Sense  # the sense chosen from the word's own entry
    cross_ref: Optional[str]  # set if `definition` came from another word
    unresolved: Optional[str] = None  # a cross-reference that couldn't be followed


class Definitions:
    def __init__(self, entries=None):
        if entries is None:
            entries = read_dump()
            entries.update(EXTRA_WORDS)
        self.entries = entries

    def senses(self, word, homograph=None):
        raw = self.entries.get(word, "")
        if homograph is not None:
            # "hem 2": only the entry headed hem<sup>2</sup>
            blocks = [
                b for b in raw.split(HOMOGRAPH_SEPARATOR)
                if re.search(rf"<b>{re.escape(word)}<sup>{homograph}</sup></b>", b)
            ]
            raw = blocks[0] if blocks else raw
        return senses(word, raw)

    def lookup(self, word, homograph=None, sense_number=None, pos=None, _depth=0):
        """The first valid sense of `word`, following cross-references.

        When following one, `pos` is the referring sense's part of speech:
        "elevator: noun North American term for lift (in sense 1)" means the
        noun lift, not the verb.
        """
        found = self.senses(word, homograph)
        if pos is not None:
            wanted = pos.split("&")[0].strip()
            found = [s for s in found if wanted in s.pos] or found
        if sense_number is not None:
            found = [s for s in found if s.number == int(sense_number)] or found
        unresolved = None
        for sense in found:
            m = CROSS_REF_RE.match(sense.definition)
            if not m:
                return Lookup(sense.pos, sense.definition, sense, None)
            if _depth >= MAX_CROSS_REFS:
                continue  # a loop ("enure" -> "inure" -> "enure") or a long chain
            target = m.group("target").strip()
            if target != word:
                resolved = self.lookup(
                    target, m.group("homograph"), m.group("sense"), sense.pos, _depth + 1
                )
                if resolved:
                    definition = _without_mentions(resolved.definition, word)
                    return Lookup(sense.pos, definition, sense, target)
            # Couldn't follow it ("inure: variant spelling of enure", which
            # points back): try the next sense, else show the pointer.
            unresolved = unresolved or Lookup(sense.pos, sense.definition, sense, None, target)
        return unresolved

    def definition(self, word):
        """The first valid sense of `word`, or None if COED has none."""
        found = self.lookup(word)
        return found.definition if found else None


if __name__ == "__main__":
    definitions = Definitions()
    for word in sys.argv[1:]:
        print(f"{word}: {definitions.definition(word)}")
        for sense in definitions.senses(word):
            notes = [n for n in ("phrase", "capitalized", "offensive", "fallback") if getattr(sense, n)]
            print(f"  {sense.pos:12} {sense.definition}" + (f"  [{', '.join(notes)}]" if notes else ""))
