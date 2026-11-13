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
| `R-*` | Breaks a rule: `R-plural`, `R-inflection`, `R-ly`, `R-redirect` (an index entry that only points to another headword, e.g. `hands → hand`) |
| `P-adj` | Policy question: a participle COED only notes as "[as adjective X]" (e.g. `thatched`, `nauseating`) |

## Results

| | In current list (400) | Not in list (100) |
|---|---|---|
| A (answer) | 332 (83%) | **9** |
| B (accept only) | **52 (13%)** | 81 |
| O (offensive) | 2 | 1 |
| R (rule violation) | **8 (2%)** | 9 |
| P-adj (policy) | 6 (1.5%) | 0 |

Rough estimates for the whole list (small sample, so treat as ballpark):

- **About 2,700 obscure words** in the 20,711-word list are currently *required* answers.
  Examples: surd, tocsin, epitaxy, yttrium, induna, quorate, decoke, lickerish.
- **About 400 clear rule violations.** Most are index redirect entries for plurals: hands,
  groceries, greetings, sands, clutches, strains, cloaks.
- **About 300 participle-as-adjective words** that depend on how strictly the rules are read:
  thatched, stranded, forested, blemished, blanched, nauseating.
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
2. **Code catches redirect entries reliably, but can't decide them alone.** All 15 redirect
   entries in the sample were flagged correctly. Only 7 should be rejected, though: `glowing`
   and `angling` are real adjective/noun senses, and 6 are the policy case above. The right
   setup is to flag them in code and review the flagged ones.
3. **One rule, read literally, would reject familiar words.** `spaghetti` (COED: "plural noun")
   is disallowed by the "folk" clause in `RULES.md`. Expect similar cases (e.g. scissors,
   trousers). This needs an owner decision.
4. **Review was quick and decisive when the dictionary entry was provided.** Most words were
   obvious; the hard calls are where A ends and B begins, which is subjective. A second
   independent pass on B/A borderline words would make it more consistent.

## Decisions needed from the owner

- Allow participles that COED only notes "as adjective"? (`P-adj`)
- Allow COED "plural noun" words such as spaghetti, against the literal rule?
- Should offensive-but-valid words (`O`) be accepted as guesses, or rejected entirely?
- Adopt the two-tier model (required answers = `A`, accepted guesses = `A` + `B`)? This needs a
  small change in `src/classes/GameModel.js` and the puzzle JSON.
