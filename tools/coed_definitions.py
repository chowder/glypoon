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
  ("(given to) inclined or disposed to").

A sense that only points at another word ("another term for alley",
"variant spelling of emir") is replaced by that word's definition.

Usage:
  python coed_definitions.py WORD [WORD ...]
"""

import html
import re
import sys

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
SET_PHRASE_RE = re.compile(r'^\(\s*(also |often |usu\. )?<c c="darkslategray">')
JOIN = r"(\s*(,|or|and|&amp;|&)\s*)"
# Usage labels ("informal", "N. Amer. or Irish & Scottish"), pronunciations,
# and extra parts of speech ("adjective, adverb, & exclamation").
LABELS_RE = re.compile(
    rf'(<c c="(slateblue|seagreen|darkcyan)">.*?</c>|<i>[^<]*</i>)'
    rf'({JOIN}?<c c="(slateblue|seagreen|darkcyan)">.*?</c>|{JOIN}<i>[^<]*</i>)*'
)
FORM_WORDS = r"(past|present|plural|tense|participle|person|singular|second|third|form|and|or)"
FORM_OF_RE = re.compile(
    rf"^((archaic|literary|dialect|nonstandard|informal) )?"
    rf"(past|present|plural|comparative|superlative|second|third)( {FORM_WORDS})* of\b"
    r"|\b(compar|superl)\. of\b"
    r"|\b(comparative|superlative) of\b",
    re.I,
)
CROSS_REF_RE = re.compile(
    r"^(?:(?:[\w.]+ ){0,3}(?:variant|spelling|form) of"
    r"|(?:[\w.]+ )?(?:term|name|word) for"
    r"|=)\s+(?P<target>[a-z][a-z' -]*?)(?:\s+(?P<homograph>\d+)\b.*|\s*\(.*\)\.?|\.)?$",
    re.I,
)
MAX_CROSS_REFS = 2


def _plain(raw):
    s = re.sub(r"<[^>]+>", " ", raw)
    return re.sub(r"\s+", " ", html.unescape(s)).strip()


def _clean(raw):
    s = re.sub(r'<c c="gray">.*?</c>', "", raw)  # example phrases
    s = LABELS_RE.sub("", s)
    s = re.sub(r"\[[^\]]*\]", "", s)  # grammar notes
    s = _plain(s).replace("↘", "")
    s = re.sub(r"^\d+》", "", s).strip()
    s = re.sub(r"^([,&]|or\b|and\b|\s)+", "", s)
    s = re.sub(r"\(\s*(usu\.|also|often|e\.g\.)?\s*\)", "", s)  # brackets emptied above
    s = re.sub(r"\)\s*(or|and|&)\s+", ") ", s)  # "(usu. ablutions) or an act"
    s = re.sub(r"\s+([,.;:)])", r"\1", s)
    s = re.sub(r"\(\s+", "(", s)
    s = re.sub(r"[\s:;,]+$", "", s)  # left by a removed example ("... young woman:")
    s = re.sub(r"\s+", " ", s).strip()
    if s and s[-1] not in ".!?":
        s += "."
    return s


def senses(word, raw, allow_irregular_adjectives=False):
    """Valid senses of `word` as (part of speech, definition), in entry order.

    Senses tied to a set phrase come after all other senses.
    """
    plain, phrase = [], []
    for block in raw.split(HOMOGRAPH_SEPARATOR):
        pos = None
        for line in block.split("\n"):
            if HEADING_RE.search(line):
                pos = None
                continue
            m = POS_RE.search(line)
            if m:
                pos = html.unescape(m.group(1)).strip()
                # Drop labels and inflections before an inline sense:
                # "■ verb (spurs, spurring, spurred)", "■ noun informal a cat."
                line = LABELS_RE.sub("", m.group(2))
                line = re.sub(r"^\s*((\(.*?\)|,|&amp;|&|or\b|and\b)\s*)+", "", line)
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
            body = SENSE_NUMBER_RE.sub("", line)
            (phrase if SET_PHRASE_RE.search(body) else plain).append((pos, definition))
    if not plain and not phrase and not allow_irregular_adjectives and word in IRREGULAR_COMPARATIVES:
        # Adjective only ("lesser", "eldest"): show that rather than nothing.
        return senses(word, raw, allow_irregular_adjectives=True)
    return plain + phrase


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

    def definition(self, word, homograph=None, _depth=0):
        """The first valid sense of `word`, or None if COED has none."""
        found = self.senses(word, homograph)
        if not found:
            return None
        definition = found[0][1]
        m = CROSS_REF_RE.match(definition)
        if m and _depth < MAX_CROSS_REFS:
            target = m.group("target").strip()
            if target != word:
                resolved = self.definition(target, m.group("homograph"), _depth + 1)
                if resolved:
                    return resolved
        return definition


if __name__ == "__main__":
    definitions = Definitions()
    for word in sys.argv[1:]:
        print(f"{word}: {definitions.definition(word)}")
        for pos, definition in definitions.senses(word):
            print(f"  {pos:12} {definition}")
