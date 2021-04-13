import { useStoreActions, useStoreState } from 'easy-peasy'
import { useState } from 'react'
import GameState from '../classes/GameState'

const Welcome = () => {
    const gameDuration = useStoreState(store => store.secondsRemaining)
    const setGameState = useStoreActions(actions => actions.setGameState)
    const [visible, setVisible] = useState(true)

    const handleClick = () => {
        setVisible(false)
        setGameState(GameState.RUNNING)
    }

    return (
        <div className={`${visible ? "" : "ease-in duration-200 invisible"} fixed z-10 inset-0`}>
            <div className="flex items-center justify-center min-h-screen px-6 pb-20 text-center">
                {/* Blurred background */}
                <div className={`${visible ? "" : "ease-in duration-200 opacity-0"} transition-opacity fixed inset-0 blur-background`}></div>
                <span className="hidden align-middle h-screen">&#8203;</span>
                {/* Modal panel */}
                <div className={`${visible ? "" : "ease-in duration-100 opacity-0 -translate-y-4 sm:translate-y-0 sm:scale-95"} pop-up-panel`}>
                    <div className="pop-up-text-subpanel">
                        <div className="text-center">
                            <p className="pop-up-title">
                                Glypoon
                            </p>
                            <p className="pop-up-subtext">
                                Create as many words as you can in {Math.floor(gameDuration / 60)} minutes!
                            </p>
                        </div>
                    </div>
                    <div className="pop-up-buttons-subpanel">
                        <button
                            type="button"
                            className="pop-up-button border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500"
                            onClick={handleClick}
                        >
                            Play
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Welcome
