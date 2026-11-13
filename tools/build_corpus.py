"""Build corpuses/glypoon.txt from the COED dump and the word review.

Two stages:

1. Rules (deterministic): every lowercase, letters-only COED headword of
   3-10 letters is checked against RULES.md using its dictionary entry.
   Words that pass are "candidates".
2. Review: each candidate has a decision in word_review/review.tsv:
     A  well known: in the corpus
     B  valid but obscure, technical, archaic, regional, or a variant
        spelling: not in the corpus
     O  offensive: not in the corpus

Usage:
  python build_corpus.py                 # write corpuses/glypoon.txt
  python build_corpus.py --candidates F  # write candidates (word<TAB>gloss) to F
  python build_corpus.py --rejects F     # write rule rejects (word<TAB>reason) to F
"""

import argparse
import html
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DUMP = os.path.join(HERE, "dictionaries", "COED", "dump.txt")
REVIEW = os.path.join(HERE, "word_review", "review.tsv")
CORPUS = os.path.join(HERE, "corpuses", "glypoon.txt")

MIN_LENGTH = 3
MAX_LENGTH = 10

# Parts of speech that never make a word valid on their own.
NON_WORD_POS = {
    "abbreviation",
    "symbol",
    "combining form",
    "prefix",
    "suffix",
}

# Valid words the dictionary files have no headword for. "lots" (adverb) is
# given as an allowed example in RULES.md but only appears under "lot".
EXTRA_WORDS = {
    "lots": "■ adverb informal a great deal; much.",
}

POS_RE = re.compile(r'■ <c c="green">(.*?)</c>')


def read_dump(path=DUMP):
    entries = {}
    word, lines = None, []
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            if line == "------":
                if word is not None:
                    entries[word] = "\n".join(lines)
                word, lines = None, []
            elif word is None:
                word, _, rest = line.partition(":")
                lines = [rest]
            else:
                lines.append(line)
    return entries


def parts_of_speech(raw):
    """Each POS label in the entry, split on '&' (e.g. 'noun & adjective')."""
    labels = []
    for label in POS_RE.findall(raw):
        for part in html.unescape(label).split("&"):
            part = part.strip()
            if part:
                labels.append(part)
    return labels


def text(raw):
    s = re.sub(r"<k>.*?</k>", "", raw)
    s = re.sub(r"<kref>(.*?)</kref>", r"\1", s)
    s = re.sub(r"<[^>]+>", " ", s)
    s = html.unescape(s)
    return re.sub(r"\s+", " ", s).strip()


def gloss(raw, limit=120):
    """A short definition for reviewers: the text up to Phrases/Derivatives/Origin."""
    s = text(raw)
    s = re.split(r"\b(Phrases|Derivatives|Origin|Usage|Word History)\b", s)[0]
    s = re.sub(r"\[[^\]]*[ˈ'ʌɪəʊɒɔːθðʃʒŋæɛ:][^\]]*\]", "", s)  # pronunciations
    return re.sub(r"\s+", " ", s).strip()[:limit]


def check_rules(word, raw):
    """Return None if the word passes RULES.md, else a short reason."""
    if not re.fullmatch(r"[a-z]+", word):
        return "not lowercase letters only"
    if not MIN_LENGTH <= len(word) <= MAX_LENGTH:
        return "length"

    pos = parts_of_speech(raw)
    if not pos:
        # No part of speech of its own: an index entry pointing at another
        # headword. Covers inflections ("past of", "plural form of"),
        # inflected senses ("hands", "sands") and forms only noted under a
        # verb ("[as adjective worried]", "[often as noun angling]").
        return "no entry of its own (inflection or form noted under another word)"

    word_pos = [p for p in pos if p not in NON_WORD_POS]
    if not word_pos:
        return "only " + "/".join(sorted(set(pos)))

    # Comparatives/superlatives listed only as adjective/adverb forms, e.g.
    # "driest: adjective superlative of dry", "furthest: used as superlative
    # of far". Ones with other senses (better: noun, verb) are allowed.
    body = text(raw)
    if re.search(
        r"^(\S+ \d )?(\(.*?\) )?(used as )?(■ [a-z& ]+ )?(comparative|superlative) of\b",
        body,
    ) and set(word_pos) <= {"adjective", "adverb"}:
        return "comparative or superlative"

    if word.endswith("ly") and set(word_pos) <= {
        "adverb",
        "related adverb",
        "interrogative adverb",
    }:
        return "adverb ending in -ly"

    return None


def load_review(path=REVIEW):
    review = {}
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            if not line or line.startswith("#"):
                continue
            word, decision, *_ = line.split("\t")
            review[word] = decision
    return review


def main(argv):
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--candidates", help="write candidates to this file")
    parser.add_argument("--rejects", help="write rule rejects to this file")
    args = parser.parse_args(argv)

    entries = read_dump()
    entries.update(EXTRA_WORDS)
    candidates, rejects = {}, {}
    for word, raw in entries.items():
        if not re.fullmatch(r"[a-z]+", word) or not MIN_LENGTH <= len(word) <= MAX_LENGTH:
            continue
        reason = check_rules(word, raw)
        if reason:
            rejects[word] = reason
        else:
            candidates[word] = raw

    if args.candidates or args.rejects:
        if args.candidates:
            with open(args.candidates, "w", encoding="utf-8") as f:
                for word in sorted(candidates):
                    f.write(f"{word}\t{gloss(candidates[word])}\n")
        if args.rejects:
            with open(args.rejects, "w", encoding="utf-8") as f:
                for word in sorted(rejects):
                    f.write(f"{word}\t{rejects[word]}\n")
        print(f"{len(candidates)} candidates, {len(rejects)} rule rejects")
        return

    review = load_review()
    missing = sorted(set(candidates) - set(review))
    if missing:
        sys.exit(f"{len(missing)} candidates have no review decision, e.g. {missing[:10]}")
    words = sorted(w for w in candidates if review[w] == "A")
    with open(CORPUS, "w", encoding="utf-8") as f:
        f.write("\n".join(words))
    print(f"Wrote {len(words)} words to {CORPUS}")


if __name__ == "__main__":
    main(sys.argv[1:])
