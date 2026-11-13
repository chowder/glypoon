import { useStoreState } from 'easy-peasy'
import { Fragment, useState, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import GameState from '../classes/GameState'

const Congratulations = () => {
    const secondsRemaining = useStoreState(store => store.secondsRemaining)
    const gameState = useStoreState(store => store.gameState)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (gameState === GameState.COMPLETE) {
            setOpen(true);
        }
    }, [gameState])

    const handleClose = () => {
        setOpen(false);
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
                        leaveTo="opacity-0 -translate-y-4 sm:translate-y-0 sm:scale-95 "
                    >
                        <div className="w-full max-w-sm p-6 overflow-hidden text-center transition-all transform bg-white shadow-xl rounded-2xl">
                            <div className="mx-auto inline-flex flex-shrink-0 mb-4 items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <Dialog.Title
                                as="h3"
                                className="text-lg font-medium leading-6 text-gray-900"
                            >
                                Well done!
                            </Dialog.Title>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    Completed with {secondsRemaining} seconds to spare
                                </p>
                            </div>

                            <div className="mt-5 flex flex-row space-x-4 items-center justify-center">
                                <button
                                    type="button"
                                    className="w-full py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={handleClose}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}

export default Congratulations
