import { useStoreActions, useStoreState } from 'easy-peasy'
import GameState from '../classes/GameState'

const RevealButton = () => {
    const setNewGameDialogVisible = useStoreActions(actions => actions.setNewGameDialogVisible)
    const setGameState = useStoreActions(actions => actions.setGameState)
    const gameState = useStoreState(store => store.gameState)

    const handleClick = () => {
        setNewGameDialogVisible(true)
        if (gameState === GameState.RUNNING) {
            setGameState(GameState.PAUSED)
        }
    }

    return (
        <button
            className="reveal-button h-9 w-28 mr-4"
            onClick={handleClick}
        >
            New Game
        </button>
    )
}

export default RevealButton
