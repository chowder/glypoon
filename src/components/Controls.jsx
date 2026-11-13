import { useStoreActions, useStoreState } from 'easy-peasy'
import GameState from '../classes/GameState'
import ShuffleButton from './ShuffleButton'

const Controls = ({ onShowAnswers }) => {
    const currentInput = useStoreState(store => store.currentInput)
    const gameState = useStoreState(store => store.gameState)
    const submitAnswer = useStoreActions(actions => actions.submitAnswer)
    const startNewGame = useStoreActions(actions => actions.startNewGame)

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
            <ShuffleButton className="control-button" iconClassName="h-6 w-6" />
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
