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
                <div className={`${visible ? "" : "ease-in duration-200 opacity-0"} fixed inset-0 filter bg-blur bg-gray-700 bg-opacity-75 transition-opacity`} />
                <span className="hidden align-middle h-screen">&#8203;</span>
                {/* Modal panel */}
                <div className={`${visible ? "" : "ease-in duration-100 opacity-0 -translate-y-4 sm:translate-y-0 sm:scale-95"} inline-block align-middle bg-white rounded-lg overflow-hidden shadow-xl transform transition-all w-full max-w-xs`}>
                    <div className="bg-white px-4 pt-5 pb-4 text-center justify-center sm:p-6">
                        <div className="mx-auto inline-flex flex-shrink-0 mb-4 items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className="text-xl leading-6 font-medium text-gray-900">
                            Well done!
                            </h3>
                        <div className="mt-3">
                            <p className="text-gray-600">
                                Completed with {secondsRemaining} seconds to spare
                            </p>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6">
                        <button
                            type="button"
                            className="mt-0 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
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
