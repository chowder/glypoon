import argparse
import json
import random
import urllib.request
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
}

LETTERGON_URL = "https://lettergon.azurewebsites.net/api/puzzle/%s/%s"


def parse_arguments(argv):
    parser = argparse.ArgumentParser(
        description="Script to generate Glypoon puzzles for each day"
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

    difficulty = DIFFICULTY_BY_DAY[datetime.today().strftime("%A")]

    while True:
        contents = urllib.request.urlopen(
            LETTERGON_URL % (difficulty["max_length"], difficulty["min_length"])
        ).read()

        solution = json.loads(contents)
        if (
            len(solution["Words"]) >= MIN_NUM_SOLUTIONS
            and len(solution["Words"]) <= MAX_NUM_SOLUTIONS
        ):
            # Convert to Glypoon format
            center_letter = solution["Letters"][solution["KeyLetterIndex"]]
            print(center_letter)
            solution["Letters"].remove(center_letter)
            random.shuffle(solution["Letters"])
            solution["Letters"].insert(0, center_letter)
            solution = {
                "letters": solution["Letters"],
                "answers": solution["Words"],
            }
            print(solution)
            if args.output:
                json.dump(solution, args.output, indent=4)
                print(f"Wrote to: {args.output.name}")
            break
