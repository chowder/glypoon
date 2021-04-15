import { useStoreActions, useStoreState } from 'easy-peasy'
import { useState, Fragment } from 'react'
import { Dialog, Transition } from "@headlessui/react"
import GameState from '../classes/GameState'

const Welcome = () => {
    const gameDuration = useStoreState(store => store.secondsRemaining)
    const setGameState = useStoreActions(actions => actions.setGameState)
    const [open, setOpen] = useState(true)

    const handleClose = () => {
        setOpen(false)
        setGameState(GameState.RUNNING)
    }

    return (
        <Transition show={open} as={Fragment}>
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-10 overflow-y-auto"
                static
                open={open}
                onClose={handleClose}
            >
                <div className="min-h-screen px-8 text-center">
                    <Transition.Child
                        as={Fragment}
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
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 -translate-y-4 sm:translate-y-0 sm:scale-95 "
                    >
                        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-center align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            <Dialog.Title
                                as="h3"
                                className="text-xl font-medium leading-6 text-gray-900"
                            >
                                Glypoon
                            </Dialog.Title>
                            <div className="mt-4">
                                <p className="text-md text-gray-500">
                                    Create as many words as you can in {Math.floor(gameDuration / 60)} minutes!
                                </p>
                            </div>

                            <div className="mt-5 flex flex-row space-x-4 items-center justify-center">
                                <button
                                    type="button"
                                    className="w-full py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={handleClose}
                                >
                                    Play
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}

export default Welcome
