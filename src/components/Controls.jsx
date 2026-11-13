import { useStoreActions, useStoreState } from 'easy-peasy'
import { RefreshIcon } from '@heroicons/react/solid'
import GameState from '../classes/GameState'

const Controls = () => {
    const currentInput = useStoreState(store => store.currentInput)
    const gameState = useStoreState(store => store.gameState)
    const shuffleLetters = useStoreActions(actions => actions.shuffleLetters)
    const submitAnswer = useStoreActions(actions => actions.submitAnswer)

    const isRunning = gameState === GameState.RUNNING
    const isEmpty = currentInput.length === 0

    return (
        <div className="flex w-full space-x-3">
            <button
                type="button"
                className="control-button"
                onClick={() => shuffleLetters()}
                disabled={!isRunning}
                aria-label="Shuffle letters"
            >
                <RefreshIcon className="h-6 w-6" />
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
