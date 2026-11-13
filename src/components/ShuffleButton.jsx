import { useStoreActions, useStoreState } from 'easy-peasy'
import { RefreshIcon } from '@heroicons/react/solid'
import GameState from '../classes/GameState'

const ShuffleButton = ({ className, iconClassName }) => {
    const gameState = useStoreState(store => store.gameState)
    const shuffleCount = useStoreState(store => store.shuffleCount)
    const shuffleLetters = useStoreActions(actions => actions.shuffleLetters)

    return (
        <button
            type="button"
            className={className}
            onClick={() => shuffleLetters()}
            onMouseDown={(e) => e.preventDefault()}
            disabled={gameState !== GameState.RUNNING}
            aria-label="Shuffle letters"
            title="Shuffle letters (Space)"
        >
            <RefreshIcon
                className={`${iconClassName} ${shuffleCount > 0 ? "motion-safe:animate-shuffle" : ""}`}
                key={shuffleCount}
            />
        </button>
    )
}

export default ShuffleButton
