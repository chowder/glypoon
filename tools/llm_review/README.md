# LLM word-list review: 500-word pilot

A trial of reviewing each word by hand (by an LLM) against its actual COED entry and
[`RULES.md`](../../RULES.md), compared with the current `corpuses/glypoon.txt`.

## Method

- `build_sample.py` parses `dictionaries/COED/dump.txt` and draws a fixed sample (seed 42):
  - **400 words from `glypoon.txt`**, to check for words that shouldn't be there.
  - **100 words from COED that are *not* in `glypoon.txt`** (lowercase, letters only, 3–10
    letters), to check for good words that were wrongly left out.
- Each word was judged from its cleaned dictionary entry (part-of-speech labels plus the first
  senses), not from memory.
- Decisions are in `sample_review.csv`:

| Code | Meaning |
|------|---------|
| `A`  | Valid and well known: fine as a **required** puzzle answer |
| `B`  | Valid but obscure, technical, archaic, regional or a variant spelling: **accept** as a guess, don't require it |
| `O`  | Valid but offensive or sexual: flag for an owner decision |
| `R-*` | Breaks a rule: `R-plural`, `R-inflection`, `R-ly`, `R-redirect` (an index entry that only points to another headword, e.g. `hands → hand`), `R-participle` (see below) |

## Results

| | In current list (400) | Not in list (100) |
|---|---|---|
| A (answer) | 330 (82.5%) | **9** |
| B (accept only) | **52 (13%)** | 81 |
| O (offensive) | 2 | 1 |
| R (rule violation) | **16 (4%)** | 9 |

Rough estimates for the whole list (small sample, so treat as ballpark):

- **About 2,700 obscure words** in the 20,711-word list are currently *required* answers.
  Examples: surd, tocsin, epitaxy, yttrium, induna, quorate, decoke, lickerish.
- **About 400 clear rule violations.** Most are index redirect entries for plurals: hands,
  groceries, greetings, sands, clutches, strains, cloaks.
- **336 participles that COED only notes "as adjective"** under the verb (counted exactly, not
  estimated): thatched, stranded, worried, elated, appalling, sparkling. Now rejected; see below.
- **About 1,500 well-known words** (very rough; plausible range 700–2,800) out of the ~17,000
  COED words not in the list were wrongly left out. Examples: traipse, peccadillo, whopping,
  workaround, collider, schnauzer, declaw, capon, monopolize. Players currently get told these
  aren't words.
- Offensive senses the profanity list missed: kinky, oriental (noun sense), and shit (correctly
  excluded today, but only because it happens to be missing from `words58k`).

## What the pilot showed

1. **The current list's biggest problem is obscure words, not rule violations.** About 13% of
   required answers would frustrate a reasonable player. `words58k` lets these through and also
   rejects words like traipse and whopping.
2. **Code catches redirect entries reliably.** All 15 redirect entries in the sample were
   flagged correctly. I first marked `glowing` and `angling` as allowed, but COED lists them
   exactly like `thatched` (`[as adjective glowing]` under "glow"), so under the
   `R-participle` rule all 15 are rejected and code can decide them alone.
3. **One rule, read literally, would reject familiar words.** `spaghetti` (COED: "plural noun")
   is disallowed by the "folk" clause in `RULES.md`. Expect similar cases (e.g. scissors,
   trousers). This needs an owner decision.
4. **Review was quick and decisive when the dictionary entry was provided.** Most words were
   obvious; the hard calls are where A ends and B begins, which is subjective. A second
   independent pass on B/A borderline words would make it more consistent.

## Owner decisions

Goal: keep today's experience, with fewer edge cases and surprises.

- **Single list, no two-tier model.** The review takes over the job `words58k` does today:
  `A` words are in the list, `B` words are out.
- **Plural-only nouns (e.g. spaghetti) are allowed.** The "folk" clause in `RULES.md` needs
  updating to match.
- **Offensive words (`O`) are rejected.**
- **Participles COED only notes "as adjective" are rejected (`R-participle`).** RULES.md allows a
  verb form only if COED "explicitly lists" it as another part of speech, as with "given", which
  has its own entry with adjective senses. Words like "thatched" appear only as
  `verb [often as adjective thatched] cover with thatch` inside the verb's entry, with the
  verb's definition, so they don't qualify. This removes 336 words that are in the list today,
  including worried, elated, appalling, muted and strapped. Words with their own adjective entry
  (abandoned, bloated, reserved, given) stay. These can be detected in code from `dump.txt`:
  an entry with no part-of-speech marker of its own, a `→` link to another headword, and a body
  that starts "adjective".

Effect on this sample: 69 of the 400 current words would be removed and 9 of the 100 left-out
words added. (The full run below was more lenient with obscure words than this pilot.)

## Full run

Done; see [`../word_review/README.md`](../word_review/README.md).
