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
                <div className={`${visible ? "" : "ease-in duration-200 opacity-0"} fixed inset-0 filter bg-blur bg-gray-700 bg-opacity-75 transition-opacity`}></div>
                <span className="hidden align-middle h-screen">&#8203;</span>
                {/* Modal panel */}
                <div className={`${visible ? "" : "ease-in duration-100 opacity-0 -translate-y-4 sm:translate-y-0 sm:scale-95"} inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-xs sm:max-w-md`}>
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                        <div className="text-center">
                            <h3 className="text-xl leading-6 font-medium text-gray-900">
                                Glypoon
                            </h3>
                            <p className="mt-3 text-gray-600">
                                Create as many words as you can in {Math.floor(gameDuration / 60)} minutes!
                            </p>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6">
                        <button
                            type="button"
                            className="mt-0 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
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
