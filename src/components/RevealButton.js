import React, { useState, useEffect } from 'react'
import GameState from '../classes/GameState'

const RevealButton = ({ gameState, onClick }) => {
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        setDisabled(gameState !== GameState.RUNNING)
    }, [gameState])

    return (
        <button
            className="bg-blue-400 focus:outline-none text-white font-medium h-10 w-24 rounded-lg shadow-md disabled:opacity-40"
            onClick={onClick}
            disabled={disabled}
        >
            Solution
        </button>
    )
}

export default RevealButton
