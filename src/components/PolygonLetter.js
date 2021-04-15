import { useStoreActions, useStoreState } from "easy-peasy"
import GameState from "../classes/GameState"
import { useMemo } from 'react'



const PolygonLetter = ({ top, left, letter, index }) => {
    const currentInput = useStoreState(store => store.currentInput)
    const gameState = useStoreState(store => store.gameState)
    const lastSelectedIndex = useStoreState(store => store.lastSelectedIndex)
    const letterAvailability = useStoreState(store => store.letterAvailability)

    const setCurrentInput = useStoreActions(actions => actions.setCurrentInput)
    const setLastSelectedIndex = useStoreActions(actions => actions.setLastSelectedIndex)
    const setLetterAvailability = useStoreActions(actions => actions.setLetterAvailability)
    const submitAnswer = useStoreActions(actions => actions.submitAnswer)

    const isActive = useMemo(() => letterAvailability[index], [letterAvailability, index])

    const handleClick = () => {
        if (gameState === GameState.RUNNING) {
            if (isActive) {
                setCurrentInput(currentInput + letter)
                setLastSelectedIndex(index)
                letterAvailability[index] = false;
                setLetterAvailability([...letterAvailability]);
            } else if (lastSelectedIndex === index) {
                submitAnswer()
            }
        }
    }

    // TODO: Clean up the CSS here
    return (
        <div
            className={`transition-all ${isActive ? "polygon-letter" : "polygon-letter-disabled"} ${!isActive && lastSelectedIndex === index ? "ring-4" : ""} flex items-center justify-center h-16 w-16`}
            style={{ margin: 'auto', position: 'absolute', top: `${top}%`, left: `${left}%` }}
            onClick={handleClick}
        >
            <p className={isActive ? "polygon-letter-text" : "polygon-letter-text-disabled"}>
                {gameState === GameState.NOT_STARTED ? "" : letter?.toUpperCase()}
            </p>
        </div>
    )
}

export default PolygonLetter
