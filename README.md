# Glypoon

Glypoon is a word puzzle where the goal is to create as many words as possible using each letter provided no more than once.

## Deployments

### `main`

[![Netlify Status](https://api.netlify.com/api/v1/badges/c5130167-4b76-4964-815c-6de1d838d166/deploy-status)](https://app.netlify.com/sites/glypoon/deploys)  [![.github/workflows/make_puzzle.yml](https://github.com/chowder/glypoon/actions/workflows/make_puzzle.yml/badge.svg?branch=main)](https://github.com/chowder/glypoon/actions/workflows/make_puzzle.yml)

- https://glypoon.netlify.app

## Table of Contents

1. :notebook_with_decorative_cover: [Rules](#Rules)
2. :framed_picture: [Screenshots](#screenshots)
3. :computer: [Development](#development)

## Rules

The rules of the game can be found in [here](https://github.com/chowder/glypoon/blob/main/RULES.md).

## Screenshots

<img src="https://user-images.githubusercontent.com/16789070/113514131-cd62bb00-9564-11eb-917b-8a08f3c1c573.png" width="400">

## Development

### Getting Started

Clone this repository. You will need [`node` and `npm`](https://nodejs.org/en/download/) installed on your machine (Node 24 or newer; see `.nvmrc`).

- Installation: `npm install`
- Run: `npm run start` (serves the app at http://localhost:3000)
- Build: `npm run build`

### Puzzle Generation

The puzzles are generated daily through a [GitHub Action](https://github.com/chowder/glypoon/actions/workflows/make_puzzle.yml) and checked in to the repository under [`public/puzzle`](https://github.com/chowder/glypoon/tree/main/public/puzzle), which re-triggers the Netlify build.

### Practice Puzzles

Every possible practice puzzle is generated from the corpus by `tools/make_practice_puzzles.py` and checked in under [`public/practice`](https://github.com/chowder/glypoon/tree/main/public/practice), split into shards described by `index.json`. The app fetches a random one from GitHub at runtime. A [GitHub Action](https://github.com/chowder/glypoon/actions/workflows/make_practice_puzzles.yml) regenerates them whenever the corpus or the generator changes on `main`; to regenerate them by hand, run:

```
python tools/make_practice_puzzles.py -c tools/corpuses/glypoon.txt -o public/practice
```

### Corpus Generation

The *Concise Oxford English Dictionary* (COED) corpuses under `tools/corpuses/coed*` were generated with the `tools/dictionary_to_corpus.py` script.

The `tools/corpuses/glypoon.txt` file is the corpus used to generate the daily puzzles. It is built by `tools/build_corpus.py` from the COED dictionary files and the word-by-word review in `tools/word_review/review.tsv` (see [`tools/word_review/README.md`](tools/word_review/README.md)). The older `tools/script.ipynb` notebook is kept for reference only.
