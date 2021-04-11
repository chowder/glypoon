import { useStoreActions, useStoreState } from 'easy-peasy'
import GameState from '../classes/GameState'

const RevealButton = () => {
    const gameState = useStoreState(store => store.gameState)
    const disabled = gameState !== GameState.RUNNING
    const setRevealConfirmation = useStoreActions(actions => actions.setRevealConfirmation)

    return (
        <button
            className="bg-blue-400 focus:outline-none text-white font-medium h-10 w-24 rounded-lg shadow-md disabled:opacity-40"
            disabled={disabled}
            onClick={() => setRevealConfirmation(true)}
        >
            Solution
        </button>
    )
}

export default RevealButton
