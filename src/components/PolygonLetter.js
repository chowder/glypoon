import { useStoreActions, useStoreState } from "easy-peasy"
import GameState from "../classes/GameState"


const PolygonLetter = ({ top, left, letter, isActive, index }) => {
    const currentInput = useStoreState(store => store.currentInput)
    const gameState = useStoreState(store => store.gameState)
    const lastSelectedIndex = useStoreState(store => store.lastSelectedIndex)

    const setCurrentInput = useStoreActions(actions => actions.setCurrentInput)
    const setLastSelectedIndex = useStoreActions(actions => actions.setLastSelectedIndex)
    const submitAnswer = useStoreActions(actions => actions.submitAnswer)

    const handleClick = () => {
        if (isActive && gameState === GameState.RUNNING) {
            setCurrentInput(currentInput + letter)
            setLastSelectedIndex(index)
        }
        if (!isActive && lastSelectedIndex === index) {
            submitAnswer()
        }
    }

    // TODO: Clean up the CSS here
    return (
        <div
            className={`${isActive ? "polygon-letter" : "polygon-letter-disabled"} ${!isActive && lastSelectedIndex === index ? "ring-4" : ""} flex items-center justify-center h-16 w-16`}
            style={{ margin: 'auto', position: 'absolute', top: `${top}%`, left: `${left}%` }}
            onClick={handleClick}
        >
            <p className={isActive ? "polygon-letter-text" : "polygon-letter-text-disabled"}>
                {gameState === GameState.NOT_STARTED ? "" : letter.toUpperCase()}
            </p>
        </div>
    )
}

export default PolygonLetter
