"""Checks that definitions/definitions.tsv is complete, reviewed and up to date.

Run from tools/: python -m unittest test_build_definitions
"""

import unittest

import build_definitions
from build_corpus import CORPUS


class DefinitionsFileTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.rows, cls.problems = build_definitions.build()

    def test_every_flagged_word_is_reviewed(self):
        self.assertEqual(self.problems["unreviewed"], [], "run build_definitions.py --unreviewed")

    def test_no_stale_reviews(self):
        self.assertEqual(self.problems["stale"], [], "re-review these: extraction changed")
        self.assertEqual(self.problems["unknown"], [], "remove these from review.tsv")

    def test_every_word_has_a_definition(self):
        with open(CORPUS, encoding="utf-8") as f:
            words = {w.strip() for w in f if w.strip()}
        defined = {w for w, _, d, _ in self.rows if d}
        self.assertEqual(sorted(words - defined), [])

    def test_file_is_up_to_date(self):
        with open(build_definitions.OUT, encoding="utf-8") as f:
            current = f.read()
        self.assertTrue(
            current == build_definitions.render(self.rows),
            "definitions.tsv is out of date: run build_definitions.py",
        )


if __name__ == "__main__":
    unittest.main()
