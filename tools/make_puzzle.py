import argparse
import json
import random
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter
from datetime import datetime

MIN_NUM_SOLUTIONS = 20
MAX_NUM_SOLUTIONS = 35

DICTIONARY_API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en_US/{}"
DICTIONARY_API_RETRIES = 3

DIFFICULTY_BY_DAY = {
    "Monday": {
        "max_length": 7,
        "min_length": 3,
    },
    "Tuesday": {
        "max_length": 7,
        "min_length": 3,
    },
    "Wednesday": {
        "max_length": 8,
        "min_length": 4,
    },
    "Thursday": {
        "max_length": 8,
        "min_length": 4,
    },
    "Friday": {
        "max_length": 9,
        "min_length": 4,
    },
    "Saturday": {
        "max_length": 10,
        "min_length": 4,
    },
    "Sunday": {
        "max_length": 10,
        "min_length": 4,
    },
}


def fetch_definition(word):
    """Return the first definition of `word`, or None if none can be found.

    Never raises: a missing definition must not stop a puzzle being generated.
    """
    url = DICTIONARY_API_URL.format(urllib.parse.quote(word))
    request = urllib.request.Request(url, headers={"User-Agent": "glypoon"})
    for attempt in range(DICTIONARY_API_RETRIES):
        try:
            with urllib.request.urlopen(request, timeout=10) as response:
                entries = json.load(response)
            for entry in entries:
                for meaning in entry.get("meanings", []):
                    for definition in meaning.get("definitions", []):
                        if definition.get("definition"):
                            return definition["definition"]
            return None
        except urllib.error.HTTPError as e:
            if e.code == 404:  # The API's response for an unknown word
                return None
        except (urllib.error.URLError, OSError, ValueError):
            pass
        time.sleep(2**attempt)
    return None


def fetch_definitions(words):
    definitions = {}
    for word in words:
        definitions[word] = fetch_definition(word)
        if definitions[word] is None:
            print(f"No definition found for: {word}")
    return definitions


def parse_arguments(argv):
    parser = argparse.ArgumentParser(
        description="Script to generate Glypoon puzzles for each day"
    )
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
        type=argparse.FileType("w+"),
        required=False,
        default=None,
        help="The output file that will contain a JSON representation of the puzzle",
    )
    return parser.parse_args(argv)


if __name__ == "__main__":
    args = parse_arguments(sys.argv[1:])

    words = [word.strip() for word in args.corpus]
    difficulty = DIFFICULTY_BY_DAY[datetime.today().strftime("%A")]

    while True:
        # Choose a random word
        chosen_word = random.choice(
            list(filter(lambda word: len(word) == difficulty["max_length"], words))
        )

        # Find all pangrams of the word
        solutions_by_key_letter = {}

        for key_letter in chosen_word:
            # For each possible letter to use as the 'center letter'
            solutions_by_key_letter[key_letter] = []
            for word in words:
                if len(word) < difficulty["min_length"]:
                    continue
                if key_letter not in word:
                    continue
                if not Counter(word) - Counter(chosen_word):
                    solutions_by_key_letter[key_letter].append(word)

        solutions = []
        for key_letter, solution in solutions_by_key_letter.items():
            if (
                len(solution) >= MIN_NUM_SOLUTIONS
                and len(solution) <= MAX_NUM_SOLUTIONS
            ):
                solutions.append((key_letter, sorted(solution)))

        print(f"{len(solutions)} possible solution(s) found for {chosen_word}")
        if solutions:
            solution = random.choice(solutions)
            print(f"Center letter: {solution[0]}")
            print(f'{len(solution[1])} solutions: {", ".join(solution[1])}')

            if args.output:
                letters = [char for char in chosen_word]
                random.shuffle(letters)
                letters.remove(solution[0])
                letters.insert(
                    0, solution[0]
                )  # The key letter will always be in the center

                solution_json = {
                    "letters": letters,
                    "answers": solution[1],
                    "definitions": fetch_definitions(solution[1]),
                }
                json.dump(solution_json, args.output, indent=4)
                print(f"Wrote to: {args.output.name}")

            break
