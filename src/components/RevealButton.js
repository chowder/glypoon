import { useStoreActions, useStoreState } from 'easy-peasy'
import GameState from '../classes/GameState'

const RevealButton = () => {
    const gameState = useStoreState(store => store.gameState)
    const disabled = gameState !== GameState.RUNNING
    const setRevealConfirmation = useStoreActions(actions => actions.setRevealConfirmation)
    const setGameState = useStoreActions(actions => actions.setGameState)

    const handleClick = () => {
        setRevealConfirmation(true)
        setGameState(GameState.PAUSED)
    }

    return (
        <button
            className="reveal-button h-9 w-24"
            disabled={disabled}
            onClick={handleClick}
        >
            Solution
        </button>
    )
}

export default RevealButton
