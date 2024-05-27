import { action, thunk } from 'easy-peasy'
import GameState from './GameState';

const GAME_DURATION = parseInt(process.env.REACT_APP_GAME_DURATION || "600")  // in seconds
const EXTRA_TIME_AMOUNT = parseInt(process.env.REACT_APP_EXTRA_TIME_AMOUNT || "10")  // in seconds
const GLYPOON_API_URL = process.env.REACT_APP_GLYPOON_API_URL || "http://localhost:5000"


const model = {
    solution: {
        answers: [],
        letters: []
    },
    currentAnswers: [],
    gameState: GameState.NOT_STARTED,
    secondsRemaining: GAME_DURATION,
    currentInput: "",
    letterAvailability: [],
    lastSelectedIndex: -1,
    lastSubmissionResult: null,
    lastSubmissionAnswer: "",
    revealConfirmationVisible: false,
    newGameDialogVisible: false,

    // Thunks
    fetchSolution: thunk(async actions => {
        const res = await fetch('https://raw.githubusercontent.com/chowder/glypoon/main/public/puzzle/puzzle.json')
        const solution = await res.json()
        actions.setSolution(solution)
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

        let letterAvailability = Array(solution.letters.length)
        letterAvailability.fill(true)
        state.letterAvailability = letterAvailability
    }),

    submitAnswer: action((state) => {
        let answer = state.currentInput.toLowerCase().trim()
        state.currentInput = ""
        state.lastSelectedIndex = -1
        state.lastSubmissionAnswer = answer
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
        let countByLetters = {}
        for (let i = 0; i < state.currentInput.length; i++) {
            let letter = state.currentInput[i].toLowerCase()
            if (letter in countByLetters) {
                countByLetters[letter]++
            } else {
                countByLetters[letter] = 1
            }
        }

        let letterAvailability = []
        for (let i = 0; i < state.solution.letters.length; i++) {
            let letter = state.solution.letters[i].toLowerCase()
            if (letter in countByLetters && countByLetters[letter] > 0) {
                countByLetters[letter]--
                letterAvailability.push(false)
            } else {
                letterAvailability.push(true)
            }

        }
        state.lastSelectedIndex = -1  // This is no longer valid
        state.letterAvailability = letterAvailability
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
    })
}

export default model
