import { useStoreActions, useStoreState } from "easy-peasy"
import GameState from "../classes/GameState"

const RevealConfirmation = () => {
    const revealConfirmationVisible = useStoreState(store => store.revealConfirmationVisible)
    const setRevealConfirmation = useStoreActions(actions => actions.setRevealConfirmation)
    const setGameState = useStoreActions(actions => actions.setGameState)

    const handleContinue = () => {
        setRevealConfirmation(false)
        setGameState(GameState.RUNNING)
    }

    const handleChicken = () => {
        setRevealConfirmation(false)
        setGameState(GameState.ENDED)
    }

    return (
        <div className={`${revealConfirmationVisible ? "" : "ease-in duration-200 invisible"} fixed z-10 inset-0`}>
            <div className="flex items-center justify-center min-h-screen px-6 pb-20 text-center">
                {/* Blurred background */}
                <div className={`${revealConfirmationVisible ? "" : "ease-in duration-200 opacity-0"} transition-opacity fixed inset-0 blur-background`} />
                <span className="hidden align-middle h-screen">&#8203;</span>
                {/* Modal panel */}
                <div className={`${revealConfirmationVisible ? "" : "ease-in duration-100 opacity-0 -translate-y-4 sm:translate-y-0 sm:scale-95"} pop-up-panel`}>
                    <div className="pop-up-text-subpanel text-center justify-center">
                        <div className="mx-auto inline-flex flex-shrink-0 mb-4 items-center justify-center h-12 w-12 rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <p className="pop-up-title">
                            Chickening out?
                        </p>
                        <p className="pop-up-subtext text-gray-600">
                            Reveal the answers
                        </p>
                    </div>
                    <div className="pop-up-buttons-subpanel flex flex-row space-x-3">
                        <button
                            className="pop-up-button border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500"
                            onClick={handleContinue}
                        >
                            Continue
                        </button>
                        <button
                            className="pop-up-button bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                            onClick={handleChicken}
                        >
                            Chicken
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RevealConfirmation
