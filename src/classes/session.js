import GameState from './GameState'

// A daily game is saved to localStorage so that it can be resumed after the
// page is closed. A saved session is only good for the UTC day it was last
// saved on (a new puzzle is published shortly after midnight UTC) and for the
// puzzle it was played on.

const SESSION_KEY = 'glypoon.session'

const STORED_STATES = {
    running: GameState.RUNNING,
    ended: GameState.ENDED,
    complete: GameState.COMPLETE,
}

let lastSaved = null

const todayUtc = () => new Date().toISOString().slice(0, 10)

const puzzleId = solution => [...solution.answers].sort().join(',')

const storedStateFor = gameState => {
    switch (gameState) {
        case GameState.RUNNING:
        case GameState.PAUSED:
            return 'running'
        case GameState.ENDED:
            return 'ended'
        case GameState.COMPLETE:
            return 'complete'
        default:
            return null
    }
}

export const saveSession = state => {
    const gameState = storedStateFor(state.gameState)
    if (gameState === null || state.solution.answers.length === 0) {
        return
    }
    const session = {
        day: todayUtc(),
        puzzle: puzzleId(state.solution),
        secondsRemaining: state.secondsRemaining,
        currentAnswers: state.currentAnswers,
        gameState,
    }
    // The store changes on every keypress, so only write when the session has
    // actually changed
    const serialized = JSON.stringify(session)
    if (serialized === lastSaved) {
        return
    }
    try {
        localStorage.setItem(SESSION_KEY, serialized)
        lastSaved = serialized
    } catch (e) {
        return
    }
}

// Returns the saved session for the given puzzle, or null if there is none or
// it is no longer valid
export const loadSession = solution => {
    let session
    try {
        session = JSON.parse(localStorage.getItem(SESSION_KEY))
    } catch (e) {
        return null
    }
    if (!session || session.day !== todayUtc() || session.puzzle !== puzzleId(solution)) {
        return null
    }
    const gameState = STORED_STATES[session.gameState]
    const secondsRemaining = Number(session.secondsRemaining)
    if (!gameState || !Number.isInteger(secondsRemaining) || secondsRemaining < 0 || !Array.isArray(session.currentAnswers)) {
        return null
    }
    const currentAnswers = [...new Set(session.currentAnswers)].filter(answer => solution.answers.includes(answer))
    return { gameState, secondsRemaining, currentAnswers }
}

export const clearSession = () => {
    lastSaved = null
    try {
        localStorage.removeItem(SESSION_KEY)
    } catch (e) {
        return
    }
}
