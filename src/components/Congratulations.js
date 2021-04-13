import { useStoreState } from 'easy-peasy'
import { useState, useEffect } from 'react'
import GameState from '../classes/GameState'

const Congratulations = () => {
    const secondsRemaining = useStoreState(store => store.secondsRemaining)
    const gameState = useStoreState(store => store.gameState)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (gameState === GameState.COMPLETE) {
            setVisible(true);
        }
    }, [gameState])

    const handleClose = () => {
        setVisible(false);
    }

    return (
        <div className={`${visible ? "" : "ease-in duration-200 invisible"} fixed z-10 inset-0`}>
            <div className="flex items-center justify-center min-h-screen px-6 pb-20 text-center">
                {/* Blurred background */}
                <div className={`${visible ? "" : "ease-in duration-200 opacity-0"} fixed inset-0 transition-opacity blur-background`} />
                <span className="hidden align-middle h-screen">&#8203;</span>
                {/* Modal panel */}
                <div className={`${visible ? "" : "ease-in duration-100 opacity-0 -translate-y-4 sm:translate-y-0 sm:scale-95"} pop-up-panel`}>
                    <div className="pop-up-text-subpanel text-center justify-center">
                        <div className="mx-auto inline-flex flex-shrink-0 mb-4 items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <p className="pop-up-title">
                            Well done!
                        </p>
                        <p className="pop-up-subtext">
                            Completed with {secondsRemaining} seconds to spare
                        </p>
                    </div>
                    <div className="pop-up-buttons-subpanel">
                        <button
                            type="button"
                            className="pop-up-button border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500"
                            onClick={handleClose}
                        >
                            Close
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Congratulations
