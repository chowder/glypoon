"""Tests for coed_definitions against the checked-in COED dump.

Run from tools/: python -m unittest test_coed_definitions
"""

import unittest

from coed_definitions import Definitions


class DefinitionTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.coed = Definitions()

    def assertDefinition(self, word, expected):
        self.assertEqual(self.coed.definition(word), expected)

    def test_skips_inflection_senses(self):
        # Valid as a verb (multiply), not as the plural of "time".
        self.assertDefinition("times", "multiply (a number).")
        # Valid as a noun, not as the past of "see".
        self.assertTrue(self.coed.definition("saw").startswith("a hand tool"))
        # Valid as an adjective, not as the past participle of "give".
        self.assertDefinition("given", "specified or stated.")
        self.assertDefinition("seeing", "because; since.")
        self.assertDefinition("bats", "mad.")

    def test_skips_comparative_senses(self):
        # "better" is valid as a noun/verb, not as the comparative of "good".
        self.assertDefinition("better", "that which is better; the better one.")
        self.assertDefinition("worst", "the worst event or circumstance.")

    def test_adjective_only_irregular_comparative_falls_back(self):
        self.assertDefinition("lesser", "not so great or important as the other or the rest.")

    def test_invalid_words_have_no_definition(self):
        self.assertIsNone(self.coed.definition("raptures"))  # plural only
        self.assertIsNone(self.coed.definition("notaword"))

    def test_strips_labels_pronunciations_and_examples(self):
        self.assertDefinition("puss", "a cat.")
        self.assertDefinition("absent", "not present.")
        self.assertDefinition("adept", "very skilled or proficient.")
        self.assertDefinition("ablution", "(usu. ablutions) an act of washing.")

    def test_set_phrase_senses_come_last(self):
        senses = [d for _, d in self.coed.senses("given")]
        self.assertEqual(senses[-1], "(given to) inclined or disposed to.")

    def test_follows_cross_references(self):
        self.assertDefinition("alleyway", "a narrow passageway between or behind buildings.")
        self.assertDefinition("amir", "a title of various Muslim (mainly Arab) rulers.")
        # "hmm: variant spelling of hem 2": the hesitation sound, not hem 1.
        self.assertIn("clearing the throat", self.coed.definition("hmm"))

    def test_extra_words(self):
        self.assertDefinition("lots", "a great deal; much.")

    def test_every_corpus_word_has_a_definition(self):
        with open("corpuses/glypoon.txt", encoding="utf-8") as f:
            words = [w.strip() for w in f if w.strip()]
        missing = [w for w in words if not self.coed.definition(w)]
        self.assertEqual(missing, [])


if __name__ == "__main__":
    unittest.main()
