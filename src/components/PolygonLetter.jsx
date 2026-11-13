import { useStoreActions, useStoreState } from "easy-peasy"
import GameState from "../classes/GameState"
import { useMemo, useRef, useEffect } from 'react'



const closestAngle = (previous, target) => {
    if (previous === null) {
        return target
    }
    return previous + ((((target - previous) % 360) + 540) % 360) - 180
}

const PolygonLetter = ({ angle, radius, letter, index }) => {
    const currentInput = useStoreState(store => store.currentInput)
    const gameState = useStoreState(store => store.gameState)
    const lastSelectedIndex = useStoreState(store => store.lastSelectedIndex)
    const letterAvailability = useStoreState(store => store.letterAvailability)

    const setCurrentInput = useStoreActions(actions => actions.setCurrentInput)
    const setLastSelectedIndex = useStoreActions(actions => actions.setLastSelectedIndex)
    const setLetterAvailability = useStoreActions(actions => actions.setLetterAvailability)
    const submitAnswer = useStoreActions(actions => actions.submitAnswer)

    const isActive = useMemo(() => letterAvailability[index], [letterAvailability, index])

    const angleRef = useRef(null)
    const displayAngle = closestAngle(angleRef.current, angle)

    useEffect(() => {
        angleRef.current = displayAngle
    }, [displayAngle])

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
        <button
            type="button"
            className={`polygon-letter-move motion-reduce:transition-colors ${isActive ? "polygon-letter" : "polygon-letter-disabled"} ${!isActive && lastSelectedIndex === index ? "ring-4" : ""} flex items-center justify-center h-[22%] w-[22%]`}
            style={{
                margin: 'auto',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${displayAngle}deg) translate(${radius}cqmin) rotate(${-displayAngle}deg)`
            }}
            onClick={handleClick}
            disabled={gameState === GameState.ENDED || gameState === GameState.COMPLETE}
            onMouseDown={(e) => e.preventDefault()}
            aria-label={gameState === GameState.NOT_STARTED ? "Hidden letter" : letter?.toUpperCase()}
            aria-pressed={!isActive}
        >
            <span className={isActive ? "polygon-letter-text" : "polygon-letter-text-disabled"}>
                {gameState === GameState.NOT_STARTED ? "" : letter?.toUpperCase()}
            </span>
        </button>
    )
}

export default PolygonLetter
