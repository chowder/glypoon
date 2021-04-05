import GameState from "../classes/GameState"
import { useEffect, useState, useRef } from 'react'


const Answer = ({ text, isVisible, gameState }) => {
    const [definition, setDefinition] = useState(null)
    const tooltipRef = useRef(null);

    useEffect(() => {
        const fetchDefinition = async () => {
            console.log(`Fetching definition for: ${text}`)
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_GB/${text}`)
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

    let color = isVisible ?
        "bg-blue-200" :
        gameState === GameState.ENDED ?
            "bg-red-200" :
            "bg-gray-200"

    return (
        <div className="relative">
            <div
                className="absolute bg-green-500 text-white px-4 py-2 rounded-md flex items-center text-center transition-all duration-150 shadow-md lg:w-max max-w-sm"
                style={{ bottom: "100%", opacity: 0, visibility: "visible" }}
                ref={tooltipRef}
            >
                {definition}
            </div>
            <div
                className={`rounded-md h-8 align-middle flex justify-center items-center ${color}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <p className='text-gray-800 font-medium truncate'>{isVisible || gameState === GameState.ENDED ? text : ""}</p>
            </div >
        </div>
    )
}

export default Answer
