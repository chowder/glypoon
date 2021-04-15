import { useStoreActions, useStoreState } from "easy-peasy"
import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import GameState from "../classes/GameState"

const RevealDialog = () => {
    const open = useStoreState(store => store.revealConfirmationVisible)
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
        <Transition show={open} as={Fragment}>
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-10 overflow-y-auto"
                static
                open={open}
                onClose={handleContinue}
            >
                <div className="min-h-screen px-8 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 blur-bg" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-sm p-6 my-8 overflow-hidden text-center align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            <div className="mx-auto inline-flex flex-shrink-0 mb-4 items-center justify-center h-12 w-12 rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <Dialog.Title
                                as="h3"
                                className="text-xl font-medium leading-6 text-gray-900"
                            >
                                Giving up?
                            </Dialog.Title>
                            <div className="mt-4">
                                <p className="text-md text-gray-500">
                                    Reveal the answers
                                </p>
                            </div>

                            <div className="mt-6 flex flex-row space-x-4 items-center justify-center">
                                <button
                                    type="button"
                                    className="w-full py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={handleContinue}
                                >
                                    Continue
                                </button>
                                <button
                                    type="button"
                                    className="w-full py-2 text-sm font-medium text-white bg-red-700 border border-transparent rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    onClick={handleChicken}
                                >
                                    Show
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}

export default RevealDialog
