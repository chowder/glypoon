import { useStoreActions, useStoreState } from 'easy-peasy'
import { useState } from 'react'
import { RefreshIcon } from '@heroicons/react/solid'
import GameState from '../classes/GameState'

const Controls = ({ onShowAnswers }) => {
    const currentInput = useStoreState(store => store.currentInput)
    const gameState = useStoreState(store => store.gameState)
    const shuffleLetters = useStoreActions(actions => actions.shuffleLetters)
    const submitAnswer = useStoreActions(actions => actions.submitAnswer)
    const startNewGame = useStoreActions(actions => actions.startNewGame)

    const [shuffleCount, setShuffleCount] = useState(0)

    const handleShuffle = () => {
        shuffleLetters()
        setShuffleCount(shuffleCount + 1)
    }

    const isRunning = gameState === GameState.RUNNING
    const isEmpty = currentInput.length === 0

    if (gameState === GameState.ENDED || gameState === GameState.COMPLETE) {
        return (
            <div className="flex w-full space-x-3">
                <button
                    type="button"
                    className="control-button"
                    onClick={() => startNewGame()}
                >
                    New game
                </button>
                <button
                    type="button"
                    className="control-button-primary"
                    onClick={onShowAnswers}
                >
                    See answers
                </button>
            </div>
        )
    }

    return (
        <div className="flex w-full space-x-3">
            <button
                type="button"
                className="control-button"
                onClick={handleShuffle}
                disabled={!isRunning}
                aria-label="Shuffle letters"
            >
                <RefreshIcon
                    className={`h-6 w-6 ${shuffleCount > 0 ? "motion-safe:animate-shuffle" : ""}`}
                    key={shuffleCount}
                />
            </button>
            <button
                type="button"
                className="control-button-primary flex-[2]"
                onClick={() => submitAnswer()}
                disabled={!isRunning || isEmpty}
            >
                Enter
            </button>
        </div>
    )
}

export default Controls
