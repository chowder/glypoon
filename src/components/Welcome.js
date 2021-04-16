import { useStoreActions, useStoreState } from 'easy-peasy'
import { useState, Fragment } from 'react'
import { Dialog, Transition, Disclosure } from "@headlessui/react"
import { ChevronUpIcon } from "@heroicons/react/solid";
import GameState from '../classes/GameState'

const Welcome = () => {
    const gameDuration = useStoreState(store => store.secondsRemaining)
    const setGameState = useStoreActions(actions => actions.setGameState)
    const fetchNewSolution = useStoreActions(actions => actions.fetchNewSolution)
    const [open, setOpen] = useState(true)

    const handlePractice = () => {
        setOpen(false)
        fetchNewSolution()
    }

    const handlePlay = () => {
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
                onClose={() => {}}
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
                            <Disclosure>
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="mt-4 flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                            <span>Game rules</span>
                                            <ChevronUpIcon className={`${open ? "transform rotate-180" : ""} w-5 h-5 text-purple-500`} />
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-left text-gray-500">
                                            <ul className="list-disc px-4">
                                                <li>Each letter may only be used once</li>
                                                <li>Each word must use the center letter</li>
                                                <li>The rules for word acceptability can be found <a href="https://github.com/chowder/glypoon/blob/main/RULES.md" target="_blank" rel="noopener noreferrer" className="underline text-blue-500">here</a></li>
                                            </ul>
                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>

                            <div className="mt-5 flex flex-row space-x-4 items-center justify-center">
                                <button
                                    type="button"
                                    className="w-full py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={handlePractice}
                                >
                                    Practice
                                </button>
                                <button
                                    type="button"
                                    className="w-full py-2 text-sm font-medium text-green-900 bg-green-100 border border-transparent rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    onClick={handlePlay}
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
