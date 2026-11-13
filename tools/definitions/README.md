# Definitions

`definitions.tsv` holds the definition shown for every word in
[`../corpuses/glypoon.txt`](../corpuses/glypoon.txt). `make_puzzle.py` copies the
definitions of each puzzle's answers into `puzzle.json`.

## Why the meaning matters

A word can have several meanings, and [`RULES.md`](../../RULES.md) may make only some
of them count. The definition shown should be one that does:

| word | sense the rules reject | sense shown |
|---|---|---|
| times | plural of "time" | verb: multiply (a number) |
| saw | past of "see" | noun: a hand tool for cutting wood… |
| given | past participle of "give" | adjective: specified or stated |
| better | comparative of "good" | verb: improve on or surpass |
| apostle | "(Apostle) each of the twelve…" (capitalized) | a vigorous and pioneering supporter of an idea or cause |

## How it's built

1. **Extraction** ([`../coed_definitions.py`](../coed_definitions.py)) reads each word's
   entry in the COED dump, the same dictionary `build_corpus.py` checks the rules against.
   It skips senses the rules don't count (index entries such as "past of see",
   abbreviations and other non-word parts of speech, comparatives and superlatives, -ly
   adverbs, capitalized-only senses), puts set-phrase and offensive senses last, and
   follows cross-references ("another term for alley") to the right homograph, sense
   number and part of speech.
2. **Flags** ([`../build_definitions.py`](../build_definitions.py)) mark definitions
   extraction may have got wrong: followed or unfollowable cross-references, definitions
   that use the word itself, set-phrase-only, offensive-only or capitalized-only senses,
   irregular-comparative fallbacks, and leftover markup.
3. **Review** (`review.tsv`) has a decision for every flagged word: `ok` with the exact
   text approved, or `fix` with a replacement (and a part of speech, if the fix switches
   to a sense with a different one). If extraction later changes an approved
   definition, the decision is stale and the word has to be looked at again.

`build_definitions.py` refuses to write `definitions.tsv` while any flagged word is
unreviewed or stale, and the [Check Definitions](../../.github/workflows/check_definitions.yml)
workflow runs the same checks (`test_build_definitions.py`) on every change under `tools/`.

## After changing the word list

```
cd tools
python build_corpus.py
python build_definitions.py --unreviewed todo.tsv   # flagged words without a decision
# add a decision to definitions/review.tsv for each word in todo.tsv
python build_definitions.py
```

## First review (November 2026)

The first review was done by an LLM, reading each flagged word's extracted definition
alongside all of its valid COED senses:

- **581 flagged words** (of 21,840): 48 fixed, the rest approved as extracted. Fixes were
  mostly cross-references COED points into another entry's phrases ("onto: variant form
  of on to (see on)"), definitions that only restate the word ("painting: the action or
  process of painting"), and cases where COED's first valid sense is obscure ("pope" as
  a fish, "lime" as quicklime).
- **300 unflagged words**, sampled at random to estimate what the flags miss: 2 were
  wrong (`arcana`, `apostle`), both from extraction bugs that were then fixed in code.
- Reviewing also found extraction bugs that were fixed in code instead of by hand:
  nested inflection brackets ("billion: same)"), lost set phrases ("kilter" without
  "out of"), cross-references followed to the wrong part of speech ("elevator" → the
  verb "lift"), and trailing "Compare with …" pointers.

## Full review (November 2026)

Every remaining word (21,259 of them) was then reviewed once, in 40 chunks of about 530
words, each read by an LLM against the same written guidelines: approve by default, fix
only definitions that are garbled, only point elsewhere or restate the word, show an
obscure sense when a much more familiar valid one exists, or are wrong under the rules.

- **471 fixed** (2.2%), about 5 to 30 per chunk. All fixes were read again before being
  merged. Roughly: 158 definitions that restated the word ("the action of attending",
  "a person or thing that generates"); about 150 obscure senses replaced by familiar ones
  (`gig` as a carriage, `cohort` as a Roman unit, `router` as a woodworking tool);
  leftover labels and markup ("(lice)", "(same)", broken chemical formulas, a stray image
  filename in `tick`); words COED itself has damaged ("part" printed as "participle" in
  `element`, `ending`, `bystander` and others, typos such as "a band word round the
  wrist"); and a few that the rules exclude (`might` shown as the past of "may", `spam`
  as the trademark Spam).
- **20,788 approved** as extracted. These have no row in `review.tsv`; only flagged words
  and fixes do.

Altogether, 519 of the 21,840 definitions are hand fixes and the rest are COED's text as
extracted.
