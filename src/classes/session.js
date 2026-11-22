import GameState from './GameState'

// A saved session is only valid on the UTC day it was saved and for the same
// puzzle, as the new puzzle is published a few minutes after midnight UTC

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
    // The store changes on every keypress, so skip writes that change nothing
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
