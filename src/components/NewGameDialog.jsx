import { useStoreActions, useStoreState } from "easy-peasy"
import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import GameState from "../classes/GameState"

const NewGameDialog = () => {
    const open = useStoreState(store => store.newGameDialogVisible)
    const gameState = useStoreState(store => store.gameState)
    const setNewGameDialogVisible = useStoreActions(actions => actions.setNewGameDialogVisible)
    const startNewGame = useStoreActions(actions => actions.startNewGame)
    const setGameState = useStoreActions(actions => actions.setGameState)
    const requestInputFocus = useStoreActions(actions => actions.requestInputFocus)

    const handleContinue = () => {
        setNewGameDialogVisible(false)
        if (gameState === GameState.PAUSED) {
            setGameState(GameState.RUNNING)
        }
    }

    const handleNewGame = () => {
        setNewGameDialogVisible(false)
        startNewGame()
    }

    return (
        <Transition show={open} as={Fragment} afterLeave={() => requestInputFocus()}>
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-10 overflow-y-auto"
                static
                open={open}
                onClose={handleContinue}
            >
                <div className="flex min-h-[100dvh] items-center justify-center p-8 text-center">
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

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="w-full max-w-sm p-6 overflow-hidden text-center transition-all transform bg-white dark:bg-gray-700 shadow-xl rounded-2xl">
                            <Dialog.Title
                                as="h3"
                                className="text-xl font-medium leading-6 text-gray-900 dark:text-gray-50"
                            >
                                Start a new game?
                            </Dialog.Title>
                            <div className="mt-4">
                                <p className="text-md text-gray-500 dark:text-gray-300">
                                    You will lose all progress on the current game.
                                </p>
                            </div>

                            <div className="mt-6 flex flex-row space-x-4 items-center justify-center">
                                <button
                                    type="button"
                                    className="w-full py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 dark:text-blue-100 dark:bg-blue-500/20 dark:hover:bg-blue-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-700 focus:ring-blue-500"
                                    onClick={handleContinue}
                                >
                                    Keep playing
                                </button>
                                <button
                                    type="button"
                                    className="w-full py-2 text-sm font-medium text-white bg-indigo-700 border border-transparent rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-700 focus:ring-indigo-500"
                                    onClick={handleNewGame}
                                >
                                    New game
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}

export default NewGameDialog
