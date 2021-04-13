import { useStoreActions, useStoreState } from 'easy-peasy'
import GameState from '../classes/GameState'

const RevealButton = () => {
    const gameState = useStoreState(store => store.gameState)
    const disabled = gameState !== GameState.RUNNING
    const setRevealConfirmation = useStoreActions(actions => actions.setRevealConfirmation)

    return (
        <button
            className="reveal-button"
            disabled={disabled}
            onClick={() => setRevealConfirmation(true)}
        >
            Solution
        </button>
    )
}

export default RevealButton
