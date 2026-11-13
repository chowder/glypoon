import { useStoreActions, useStoreState } from 'easy-peasy'
import GameState from '../classes/GameState'

const RevealButton = () => {
    const gameState = useStoreState(store => store.gameState)
    const disabled = gameState !== GameState.RUNNING
    const showRevealConfirmation = useStoreActions(actions => actions.showRevealConfirmation)

    return (
        <button
            className="reveal-button h-9 w-24"
            disabled={disabled}
            onClick={() => showRevealConfirmation()}
        >
            Solution
        </button>
    )
}

export default RevealButton
