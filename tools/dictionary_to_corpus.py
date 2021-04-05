import gzip
import struct


class IfoFileReader(object):
    """Read infomation from .ifo file and parse the infomation a dictionary.
    The structure of the dictionary is shown below:
    {key, value}
    """

    def __init__(self, filename):
        """Constructor from filename.
        Arguments:
        - `filename`: the filename of .ifo file of stardict.
        May raise IfoFileException during initialization.
        """
        self._ifo = {}
        with open(filename, "r") as ifo_file:
            self._ifo["dict_title"] = ifo_file.readline().strip()  # dictionary title
            line = ifo_file.readline()  # version info
            key, equal, value = line.partition("=")
            key = key.strip()
            value = value.strip()
            # check version info, raise an IfoFileException if error encounted
            if key != "version":
                raise Exception(
                    "Version info expected in the second line of {!r:s}!".format(
                        filename
                    )
                )
            if value != "2.4.2" and value != "3.0.0":
                raise Exception(
                    "Version expected to be either 2.4.2 or 3.0.0, but {!r:s} read!".format(
                        value
                    )
                )
            self._ifo[key] = value
            # read in other infomation in the file
            # all values are all string
            for line in ifo_file:
                key, equal, value = line.partition("=")
                key = key.strip()
                value = value.strip()
                self._ifo[key] = value
            # check if idxoffsetbits should be discarded due to version info
            if self._ifo["version"] == "3.0.0" and "idxoffsetbits" in self._ifo:
                del self._ifo["version"]

    def get_ifo(self, key):
        """Get configuration value.
        Arguments:
        - `key`: configuration option name
        Return:
        - configuration value corresponding to the specified key if exists, otherwise False.
        """
        if key not in self._ifo:
            return False
        return self._ifo[key]

    def dump(self):
        """debug function"""
        for k, v in self._ifo.items():
            if type(v) is not str:
                v = str(v)
            print("%s: %s" % (k, str(v)))


class IdxFileReader(object):
    """Read dictionary indexes from the .idx file and store the indexes in a list and a dictionary.
    The list contains each entry in the .idx file, with subscript indicating the entry's origin index in .idx file.
    The dictionary is indexed by word name, and the value is an integer or a list of integers pointing to
    the entry in the list.
    """

    def __init__(self, filename, compressed=False, index_offset_bits=32):
        """
        Arguments:
        - `filename`: the filename of .idx file of stardict.
        - `compressed`: indicate whether the .idx file is compressed.
        - `index_offset_bits`: the offset field length in bits.
        """
        if compressed:
            with gzip.open(filename, "rb") as index_file:
                self._content = index_file.read()
        else:
            with open(filename, "rb") as index_file:
                self._content = index_file.read()
        self._offset = 0
        self._index = 0
        self._index_offset_bits = index_offset_bits
        self._word_idx = dict()
        self._index_idx = list()
        for word_str, word_data_offset, word_data_size, index in self:
            self._index_idx.append((word_str, word_data_offset, word_data_size))
            if word_str in self._word_idx:
                if isinstance(self._word_idx[word_str], list):
                    self._word_idx[word_str].append(len(self._index_idx) - 1)
                else:
                    self._word_idx[word_str] = [
                        self._word_idx[word_str],
                        len(self._index_idx) - 1,
                    ]
            else:
                self._word_idx[word_str] = len(self._index_idx) - 1
        del self._content
        del self._index_offset_bits
        del self._index

    def __iter__(self):
        """Define the iterator interface."""
        return self

    def __next__(self):
        """Define the iterator interface."""
        if self._offset == len(self._content):
            raise StopIteration
        word_data_offset = 0
        word_data_size = 0
        end = self._content.find(b"\0", self._offset)
        # word_str process
        word_str = self._content[self._offset : end].decode("utf-8")
        self._offset = end + 1
        # word_data_offset
        if self._index_offset_bits == 64:
            (word_data_offset,) = struct.unpack(
                "!I", self._content[self._offset : self._offset + 8]
            )
            self._offset += 8
        elif self._index_offset_bits == 32:
            (word_data_offset,) = struct.unpack(
                "!I", self._content[self._offset : self._offset + 4]
            )
            self._offset += 4
        else:
            raise ValueError
        # word_data_size
        (word_data_size,) = struct.unpack(
            "!I", self._content[self._offset : self._offset + 4]
        )
        self._offset += 4
        self._index += 1
        return (word_str, word_data_offset, word_data_size, self._index)

    def get_index_by_num(self, number):
        """Get index infomation of a specified entry in .idx file by origin index.
        May raise IndexError if number is out of range.
        Arguments:
        - `number`: the origin index of the entry in .idx file
        Return:
        A tuple in form of (word_str, word_data_offset, word_data_size)
        """
        if number >= len(self._index_idx):
            raise IndexError(
                "Index out of range! Acessing the {:d} index but totally {:d}".format(
                    number, len(self._index_idx)
                )
            )
        return self._index_idx[number]

    def get_index_by_word(self, word_str):
        """Get index infomation of a specified word entry.
        Arguments:
        - `word_str`: name of word entry.
        Return:
        Index infomation corresponding to the specified word if exists, otherwise False.
        The index infomation returned is a list of tuples, in form of [(word_data_offset, word_data_size) ...]
        """
        if word_str not in self._word_idx:
            return False
        number = self._word_idx[word_str]
        index = list()
        if isinstance(number, list):
            for n in number:
                index.append(self._index_idx[n][1:])
        else:
            index.append(self._index_idx[number][1:])
        return index

    def get_all_words(self):
        return [word for word in self._word_idx]

    def dump(self, fp):
        for word_str in self._word_idx:
            try:
                fp.write(word_str)
                fp.write("\n")
            except:  # For encoding shenanigans
                print(f"Could not write: {word_str} {type(word_str)}")
                raise


class DictFileReader(object):
    """Read the .dict file, store the data in memory for querying."""

    def __init__(self, filename, dict_ifo, dict_index, compressed=False):
        """Constructor.
        Arguments:
        - `filename`: filename of .dict file.
        - `dict_ifo`: IfoFileReader object.
        - `dict_index`: IdxFileReader object.
        """
        self._dict_ifo = dict_ifo
        self._dict_index = dict_index
        self._compressed = compressed
        self._offset = 0
        if self._compressed:
            with gzip.open(filename, "rb") as dict_file:
                self._dict_file = dict_file.read()
        else:
            with open(filename, "rb") as dict_file:
                self._dict_file = dict_file.read()

    def get_dict_by_word(self, word):
        """Get the word's dictionary data by it's name.
        Arguments:
        - `word`: word name.
        Return:
        The specified word's dictionary data, in form of dict as below:
        {type_identifier: infomation, ...}
        in which type_identifier can be any character in "mlgtxykwhnrWP".
        """
        result = list()
        indexes = self._dict_index.get_index_by_word(word)
        if indexes == False:
            return False
        sametypesequence = self._dict_ifo.get_ifo("sametypesequence")
        for index in indexes:
            self._offset = index[0]
            size = index[1]
            if sametypesequence:
                result.append(self._get_entry_sametypesequence(size))
            else:
                result.append(self._get_entry(size))
        return result

    def get_all_dicts(self):
        results = {}
        for word in self._dict_index.get_all_words():
            result = self.get_dict_by_word(word)
            results[word] = result
        return results

    def dump(self, save_file):
        """"dump all word"""
        with open(save_file, "w+", encoding="utf-8") as f:
            for w in self._dict_index._word_idx:
                meaning_lst = self.get_dict_by_word(w)
                # print('--------------------------------')
                # print(w)
                # print(self.get_dict_by_word(w))
                # print('--------------------------------')
                f.write(w)
                f.write(":")
                for m in meaning_lst:
                    f.write(" ".join(map(lambda i: i.decode("utf-8"), m.values())))
                    f.write(" ")
                f.write("\n------\n")

    def get_dict_by_index(self, index):
        """Get the word's dictionary data by it's index infomation.
        Arguments:
        - `index`: index of a word entrt in .idx file.'
        Return:
        The specified word's dictionary data, in form of dict as below:
        {type_identifier: infomation, ...}
        in which type_identifier can be any character in "mlgtxykwhnrWP".
        """
        word, offset, size = self._dict_index.get_index_by_num(index)
        self._offset = offset
        sametypesequence = self._dict_ifo.get_ifo("sametypesequence")
        if sametypesequence:
            return self._get_entry_sametypesequence(size)
        else:
            return self._get_entry(size)

    def _get_entry(self, size):
        result = dict()
        read_size = 0
        start_offset = self._offset
        while read_size < size:
            (type_identifier,) = struct.unpack(
                "!c", self._dict_file[self._offset : self._offset + 1]
            )
            self._offset += 1
            # type_identifier = str(type_identifier)
            # print(type_identifier)
            if type_identifier in "mlgtxykwhnr":
                result[type_identifier] = self._get_entry_field_null_trail()
            else:
                result[type_identifier] = self._get_entry_field_size()
            read_size = self._offset - start_offset
        return result

    def _get_entry_sametypesequence(self, size):
        start_offset = self._offset
        result = dict()
        sametypesequence = self._dict_ifo.get_ifo("sametypesequence")
        for k in range(0, len(sametypesequence)):
            # the last field has no tailing '\0'
            if sametypesequence[k] in "mlgtxykwhnr":
                if k == len(sametypesequence) - 1:
                    result[sametypesequence[k]] = self._get_entry_field_size(
                        size - (self._offset - start_offset)
                    )
                else:
                    result[sametypesequence[k]] = self._get_entry_field_null_trail()
            elif sametypesequence[k] in "WP":
                if k == len(sametypesequence) - 1:
                    result[sametypesequence[k]] = self._get_entry_field_size(
                        size - (self._offset - start_offset)
                    )
                else:
                    result[sametypesequence[k]] = self._get_entry_field_size()
        return result

    def _get_entry_field_null_trail(self):
        end = self._dict_file.find("\0", self._offset)
        result = self._dict_file[self._offset : end]
        self._offset = end + 1
        return result

    def _get_entry_field_size(self, size=None):
        # for the 'W' 'P' case
        if size is None:
            (size,) = struct.unpack(
                "!I", self._dict_file[self._offset : self._offset + 4]
            )
            self._offset += 4
        result = self._dict_file[self._offset : self._offset + size]
        self._offset += size
        return result.decode("utf-8")


if __name__ == "__main__":
    ifo_reader = IfoFileReader(
        "dictionaries/COED/Concise_Oxford_English_Dictionary.ifo"
    )
    # ifo_reader.dump()
    idx_reader = IdxFileReader(
        "dictionaries/COED/Concise_Oxford_English_Dictionary.idx"
    )
    # idx_reader.dump(sys.stdout)

    dict_reader = DictFileReader(
        "dictionaries/COED/Concise_Oxford_English_Dictionary.dict.dz",
        ifo_reader,
        idx_reader,
        True,
    )

    all_dicts = dict_reader.get_all_dicts()

    for word, word_dict in all_dicts.items():
        if not word.isalpha():
            continue
        parts = word_dict[0]["x"].split("\n")

        # PLURALS
        # if "plural noun" in word_dict[0]["x"].split("\n")[1]:
        #     print(word)
        # elif "plural form" in word_dict[0]["x"].split("\n")[1]:
        #     print(word)

        # PAST TENSES
        if "past tense of" in parts[1]:
            print(word)
        elif "past participle of" in parts[1]:
            do_print = True
            for part in parts:
                if (
                    # '■ <c c="green">adjective</c>' in part
                    '■ <c c="green">preposition</c>' in part
                    or '■ <c c="green">noun</c>' in part
                    or '■ <c c="green">conjunction</c>' in part
                ):
                    do_print = False
            if do_print:
                print(word)
        elif "past of" in parts[1]:
            print(word)

        # ADVERBS ENDING WITH -LY
        # for part in parts:
        #     if '■ <c c="green">adverb</c>' in part:
        #         if word.endswith("ly"):
        #             print(word)

        # ABBREVIATIONS
        # for part in parts:
        #     if '■ <c c="green">' in part and "abbreviation" not in part:
        #         break
        #     if '■ <c c="green">abbreviation</c>' in part:
        #         print(word)
