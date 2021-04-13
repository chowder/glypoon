import { action, thunk } from 'easy-peasy'
import GameState from './GameState';

const GAME_DURATION = parseInt((process.env.REACT_APP_GAME_DURATION | "10"))  // in seconds
const EXTRA_TIME_AMOUNT = parseInt((process.env.REACT_APP_EXTRA_TIME_AMOUNT | "10"))  // in seconds


const model = {
    solution: {
        answers: [],
        letters: []
    },
    currentAnswers: [],
    gameState: GameState.NOT_STARTED,
    secondsRemaining: GAME_DURATION,
    currentInput: "",
    lastSelectedIndex: -1,
    lastSubmissionResult: null,
    lastSubmissionAnswer: "",
    revealConfirmationVisible: false,

    // Thunks
    fetchSolution: thunk(async actions => {
        const res = await fetch('/puzzle/puzzle.json')
        const solution = await res.json()
        actions.setSolution(solution);
    }),

    // Actions
    setSolution: action((state, solution) => {
        state.solution.answers = solution.answers
        state.solution.letters = solution.letters
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
    }),

    progressTimer: action((state) => {
        if (state.secondsRemaining === 0) {
            state.gameState = GameState.ENDED
            state.currentInput = ""
            state.lastSelectedIndex = -1
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
        }
        state.gameState = value
    }),

    setRevealConfirmation: action((state, value) => {
        state.revealConfirmationVisible = value
    }),
}

export default model