import argparse
import json
import random
import sys
from collections import Counter
from datetime import datetime

MIN_NUM_SOLUTIONS = 20
MAX_NUM_SOLUTIONS = 35

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
                }
                json.dump(solution_json, args.output, indent=4)
                print(f"Wrote to: {args.output.name}")

            break
