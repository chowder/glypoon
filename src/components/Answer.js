import GameState from "../classes/GameState"
import { useEffect, useState, useRef } from 'react'
import { useStoreState } from "easy-peasy"


const Answer = ({ text, isVisible, isPangram }) => {
    const gameState = useStoreState(store => store.gameState)
    const [definition, setDefinition] = useState(null)
    const tooltipRef = useRef(null);

    // Reset the definition every time the text changes
    useEffect(() => {
        setDefinition(null)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text])

    useEffect(() => {
        const fetchDefinition = async () => {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${text}`)
            const data = await res.json()
            try {
                const entry = data.find(element => element.meanings.length > 0);
                setDefinition(entry.meanings[0].definitions[0].definition)
            } catch (e) {
                setDefinition("Could not find definition!")
            }
        }
        if ((isVisible || gameState === GameState.ENDED) && definition === null) {
            fetchDefinition()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, isVisible, gameState, definition])

    function handleMouseEnter() {
        if (isVisible || gameState === GameState.ENDED) {
            tooltipRef.current.style.opacity = 1
            tooltipRef.current.style.visibility = "visible"
            tooltipRef.current.style.marginBottom = "5px"
        }
    }

    function handleMouseLeave() {
        tooltipRef.current.style.opacity = 0
        tooltipRef.current.style.visibility = "hidden"
        tooltipRef.current.style.marginBottom = "0px"
    }

    const getColor = () => {
        // TODO: Turn these into CSS components
        if (isVisible && isPangram) {
            return "bg-gradient-to-r from-yellow-400 to-yellow-200 dark:from-yellow-600 dark:to-yellow-500"
        }
        if (isVisible) {
            return "bg-blue-200 dark:bg-blue-500"
        }
        if (gameState === GameState.ENDED) {
            return "bg-red-200 dark:bg-indigo-400"
        }

        return "bg-gray-200 dark:bg-gray-600"
    }

    let color = getColor()

    return (
        <div className="relative">
            <div
                className="absolute bg-green-500 text-white px-4 py-2 rounded-md transition-all duration-150 shadow-md lg:w-max max-w-xs"
                style={{ bottom: "100%", opacity: 0, visibility: "hidden" }}
                ref={tooltipRef}
            >
                {definition}
            </div>
            <div
                className={`answer-bg ${color}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <p className='answer-text'>{isVisible || gameState === GameState.ENDED ? text : ""}</p>
            </div >
        </div>
    )
}

export default Answer
