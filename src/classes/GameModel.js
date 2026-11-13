import { action, thunk } from 'easy-peasy'
import GameState from './GameState';

const GAME_DURATION = parseInt(import.meta.env.REACT_APP_GAME_DURATION || "600")  // in seconds
const EXTRA_TIME_AMOUNT = parseInt(import.meta.env.REACT_APP_EXTRA_TIME_AMOUNT || "10")  // in seconds
const GLYPOON_API_URL = import.meta.env.REACT_APP_GLYPOON_API_URL || "http://localhost:5000"

const computeLetterAvailability = (letters, input) => {
    let countByLetters = {}
    for (let i = 0; i < input.length; i++) {
        let letter = input[i].toLowerCase()
        if (letter in countByLetters) {
            countByLetters[letter]++
        } else {
            countByLetters[letter] = 1
        }
    }

    let letterAvailability = []
    for (let i = 0; i < letters.length; i++) {
        let letter = letters[i].toLowerCase()
        if (letter in countByLetters && countByLetters[letter] > 0) {
            countByLetters[letter]--
            letterAvailability.push(false)
        } else {
            letterAvailability.push(true)
        }
    }
    return letterAvailability
}


const model = {
    solution: {
        answers: [],
        letters: [],
        // Map of answer -> definition (or null if none was found). Older
        // puzzles don't include definitions, in which case this stays null and
        // definitions are fetched from the dictionary API instead.
        definitions: null
    },
    currentAnswers: [],
    gameState: GameState.NOT_STARTED,
    secondsRemaining: GAME_DURATION,
    currentInput: "",
    letterAvailability: [],
    letterIds: [],
    lastSelectedIndex: -1,
    lastSubmissionResult: null,
    lastSubmissionAnswer: "",
    submissionCount: 0,
    revealConfirmationVisible: false,
    newGameDialogVisible: false,
    // Incremented to ask the answer input to take focus, e.g. once a dialog has
    // finished closing (the dialog returns focus to the page when it closes).
    inputFocusRequests: 0,

    // Thunks
    fetchSolution: thunk(async actions => {
        const res = await fetch('https://raw.githubusercontent.com/chowder/glypoon/main/public/puzzle/puzzle.json')
        const solution = await res.json()
        actions.setSolution(solution)
    }),

    startNewGame: thunk(async actions => {
        actions.setGameState(GameState.NOT_STARTED)
        await actions.fetchNewSolution()
    }),

    fetchNewSolution: thunk(async actions => {
        const res = await fetch(`${GLYPOON_API_URL}/get_puzzle`)
        const solution = await res.json()
        actions.setSolution(solution)
        actions.resetGame()
    }),

    // Actions
    resetGame: action((state) => {
        state.currentAnswers = []
        state.gameState = GameState.RUNNING
        state.secondsRemaining = GAME_DURATION
        state.currentInput = ""
        state.lastSelectedIndex = -1
        state.lastSubmissionResult = null
        state.lastSubmissionAnswer = ""
    }),

    setSolution: action((state, solution) => {
        state.solution.answers = solution.answers
        state.solution.letters = solution.letters
        state.solution.definitions = solution.definitions || null
        state.letterIds = solution.letters.map((letter, i) => i)

        let letterAvailability = Array(solution.letters.length)
        letterAvailability.fill(true)
        state.letterAvailability = letterAvailability
    }),

    submitAnswer: action((state) => {
        let answer = state.currentInput.toLowerCase().trim()
        state.currentInput = ""
        state.lastSelectedIndex = -1
        state.lastSubmissionAnswer = answer
        state.submissionCount += 1
        if (state.solution.answers.includes(answer) && !state.currentAnswers.includes(answer)) {
            state.lastSubmissionResult = true
            state.currentAnswers = [...state.currentAnswers, answer]
        } else {
            state.lastSubmissionResult = false
        }

        state.letterAvailability = state.letterAvailability.map(() => true)
    }),

    progressTimer: action((state) => {
        if (state.secondsRemaining === 0) {
            state.gameState = GameState.ENDED
            state.currentInput = ""
            state.lastSelectedIndex = -1
            state.letterAvailability = state.letterAvailability.map(() => true)
        } else {
            state.secondsRemaining = state.secondsRemaining - 1
        }
    }),

    addExtraTime: action((state) => {
        if (state.gameState === GameState.RUNNING) {
            state.secondsRemaining += EXTRA_TIME_AMOUNT
        }
    }),

    setCurrentInput: action((state, value) => {
        state.currentInput = value
    }),

    setLetterAvailability: action((state, value) => {
        state.letterAvailability = value
    }),

    recalculateLetterAvailability: action((state) => {
        state.lastSelectedIndex = -1  // This is no longer valid
        state.letterAvailability = computeLetterAvailability(state.solution.letters, state.currentInput)
    }),

    typeLetter: action((state, letter) => {
        const index = state.solution.letters.findIndex((element, i) => element === letter && state.letterAvailability[i])
        if (index !== -1) {
            state.currentInput = state.currentInput + letter
            state.letterAvailability[index] = false
            state.lastSelectedIndex = index
        }
    }),

    deleteLetter: action((state) => {
        state.currentInput = state.currentInput.slice(0, -1)
        state.lastSelectedIndex = -1
        state.letterAvailability = computeLetterAvailability(state.solution.letters, state.currentInput)
    }),

    shuffleLetters: action((state) => {
        let order = [...state.solution.letters.keys()].slice(1)
        for (let i = order.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [order[i], order[j]] = [order[j], order[i]]
        }
        order = [0, ...order]
        state.solution.letters = order.map(i => state.solution.letters[i])
        state.letterAvailability = order.map(i => state.letterAvailability[i])
        state.letterIds = order.map(i => state.letterIds[i])
        state.lastSelectedIndex = order.indexOf(state.lastSelectedIndex)
    }),

    setLastSelectedIndex: action((state, value) => {
        state.lastSelectedIndex = value
    }),

    setLastSubmissionResult: action((state, value) => {
        state.lastSubmissionResult = value
    }),

    setGameState: action((state, value) => {
        if (value === GameState.COMPLETE || value === GameState.ENDED) {
            state.currentInput = "";
            state.lastSelectedIndex = -1;
            state.letterAvailability = state.letterAvailability.map(() => true)
        }
        state.gameState = value
    }),

    setRevealConfirmation: action((state, value) => {
        state.revealConfirmationVisible = value
    }),

    setNewGameDialogVisible: action((state, value) => {
        state.newGameDialogVisible = value
    }),

    showNewGameDialog: action((state) => {
        state.newGameDialogVisible = true
        if (state.gameState === GameState.RUNNING) {
            state.gameState = GameState.PAUSED
        }
    }),

    showRevealConfirmation: action((state) => {
        state.revealConfirmationVisible = true
        state.gameState = GameState.PAUSED
    }),

    requestInputFocus: action((state) => {
        state.inputFocusRequests += 1
    })
}

export default model
