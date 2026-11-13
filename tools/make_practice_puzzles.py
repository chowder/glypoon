"""Generate every possible practice puzzle from a corpus.

Puzzles follow the same rules as the daily puzzles made by make_puzzle.py: a
7 to 10 letter base word, a centre letter that every answer must contain, and
between MIN_NUM_SOLUTIONS and MAX_NUM_SOLUTIONS answers. Puzzles with the same
letters and centre letter (e.g. from anagrams like "pasture" and "uprates") are
only written once.

The puzzles are shuffled and split into shards of SHARD_SIZE puzzles, written
to <output>/shard-NNN.json, with <output>/index.json describing them. The app
picks a random puzzle by fetching the index and then a single shard.

A fixed random seed keeps the output stable, so it only changes when the corpus
(or these rules) change.
"""

import argparse
import json
import os
import random
import sys
from collections import defaultdict
from itertools import combinations

from make_puzzle import MAX_NUM_SOLUTIONS, MIN_NUM_SOLUTIONS

# Base word length -> minimum answer length, matching DIFFICULTY_BY_DAY
MIN_LENGTH_BY_BASE_LENGTH = {7: 3, 8: 4, 9: 4, 10: 4}

SHARD_SIZE = 250
SEED = 1


def sub_multisets(letters, min_length):
    """Yield each distinct sorted sub-multiset of `letters` of at least `min_length`."""
    letters = "".join(sorted(letters))
    seen = set()
    for length in range(min_length, len(letters) + 1):
        for combination in combinations(letters, length):
            key = "".join(combination)
            if key not in seen:
                seen.add(key)
                yield key


def make_puzzles(words, rng):
    words_by_key = defaultdict(list)
    for word in words:
        words_by_key["".join(sorted(word))].append(word)

    puzzles = []
    for key in sorted(words_by_key):
        if len(key) not in MIN_LENGTH_BY_BASE_LENGTH:
            continue
        min_length = MIN_LENGTH_BY_BASE_LENGTH[len(key)]
        candidates = []
        for sub_key in sub_multisets(key, min_length):
            candidates.extend(words_by_key.get(sub_key, ()))

        for centre in sorted(set(key)):
            answers = sorted(word for word in candidates if centre in word)
            if MIN_NUM_SOLUTIONS <= len(answers) <= MAX_NUM_SOLUTIONS:
                letters = list(key)
                letters.remove(centre)
                rng.shuffle(letters)
                # The centre letter always comes first
                puzzles.append({"letters": [centre] + letters, "answers": answers})

    rng.shuffle(puzzles)
    return puzzles


def write_shards(puzzles, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    for name in os.listdir(output_dir):
        if name.startswith("shard-") and name.endswith(".json"):
            os.remove(os.path.join(output_dir, name))

    shards = [puzzles[i : i + SHARD_SIZE] for i in range(0, len(puzzles), SHARD_SIZE)]
    for number, shard in enumerate(shards):
        path = os.path.join(output_dir, f"shard-{number:03d}.json")
        with open(path, "w") as f:
            # One puzzle per line keeps diffs readable
            f.write("[\n")
            f.write(",\n".join(json.dumps(p, separators=(",", ":")) for p in shard))
            f.write("\n]\n")

    index = {"count": len(puzzles), "shardSize": SHARD_SIZE, "shards": len(shards)}
    with open(os.path.join(output_dir, "index.json"), "w") as f:
        json.dump(index, f, indent=4)
        f.write("\n")
    return index


def parse_arguments(argv):
    parser = argparse.ArgumentParser(description="Generate all Glypoon practice puzzles")
    parser.add_argument(
        "--corpus",
        "-c",
        type=argparse.FileType("r"),
        required=True,
        help="A file containing a list of words",
    )
    parser.add_argument(
        "--output",
        "-o",
        required=True,
        help="The directory to write the shards and index.json to",
    )
    return parser.parse_args(argv)


if __name__ == "__main__":
    args = parse_arguments(sys.argv[1:])
    words = sorted({word.strip() for word in args.corpus if word.strip()})
    puzzles = make_puzzles(words, random.Random(SEED))
    index = write_shards(puzzles, args.output)
    print(f"Wrote {index['count']} puzzles in {index['shards']} shards to {args.output}")
