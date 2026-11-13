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
    const requestInputFocus = useStoreActions(actions => actions.requestInputFocus)

    const handlePractice = () => {
        setOpen(false)
        fetchNewSolution()
    }

    const handlePlay = () => {
        setOpen(false)
        setGameState(GameState.RUNNING)
    }

    return (
        <Transition show={open} as={Fragment} afterLeave={() => requestInputFocus()}>
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-10 overflow-y-auto"
                static
                open={open}
                onClose={() => {}}
            >
                <div className="flex min-h-[100dvh] items-center justify-center p-8 text-center">
                    <Transition.Child
                        as={Fragment}
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 blur-bg" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 -translate-y-4 sm:translate-y-0 sm:scale-95 "
                    >
                        <div className="w-full max-w-md p-6 overflow-hidden text-center transition-all transform bg-white dark:bg-gray-700 shadow-xl rounded-2xl">
                            <Dialog.Title
                                as="h3"
                                className="text-xl font-medium leading-6 text-gray-900 dark:text-gray-50"
                            >
                                Glypoon
                            </Dialog.Title>
                            <div className="mt-4">
                                <p className="text-md text-gray-500 dark:text-gray-300">
                                    Create as many words as you can in {Math.floor(gameDuration / 60)} minutes!
                                </p>
                            </div>
                            <Disclosure defaultOpen>
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="mt-4 flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-lemon-900 bg-lemon-100 rounded-lg hover:bg-lemon-200 dark:text-lemon-100 dark:bg-lemon-400/20 dark:hover:bg-lemon-400/30 focus:outline-none focus-visible:ring focus-visible:ring-lemon-500 focus-visible:ring-opacity-75">
                                            <span>Updates</span>
                                            <ChevronUpIcon className={`${open ? "transform rotate-180" : ""} w-5 h-5 text-lemon-600 dark:text-lemon-300`} />
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-left text-gray-500 dark:text-gray-300 space-y-3">
                                            <p>Hi friends! (especially those at Macquarie)</p>
                                            <p>I finally took the time to give Glypoon a little more love, mostly because AI has now made it so easy to do so.</p>
                                            <p>I've updated the Glypoon word list, which should now more accurately reflect Polygon's acceptability criteria.</p>
                                            <p>Please let me know if you feel like the new word list is better, or worse. You can reach me at <a href="mailto:andrew@cho.io" className="underline text-blue-500 dark:text-blue-300">andrew@cho.io</a>; hope you guys have been well!</p>
                                            <p>Andrew</p>
                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>
                            <Disclosure>
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="mt-4 flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-purple-100 rounded-lg hover:bg-purple-200 dark:text-purple-100 dark:bg-purple-500/20 dark:hover:bg-purple-500/30 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                            <span>Game rules</span>
                                            <ChevronUpIcon className={`${open ? "transform rotate-180" : ""} w-5 h-5 text-purple-500`} />
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-left text-gray-500 dark:text-gray-300">
                                            <ul className="list-disc px-4">
                                                <li>Each letter may only be used once</li>
                                                <li>Each word must use the center letter</li>
                                                <li>The rules for word acceptability can be found <a href="https://github.com/chowder/glypoon/blob/main/RULES.md" target="_blank" rel="noopener noreferrer" className="underline text-blue-500 dark:text-blue-300">here</a></li>
                                            </ul>
                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>

                            <div className="mt-5 flex flex-row space-x-4 items-center justify-center">
                                <button
                                    type="button"
                                    className="w-full py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 dark:text-blue-100 dark:bg-blue-500/20 dark:hover:bg-blue-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-700 focus:ring-blue-500"
                                    onClick={handlePractice}
                                >
                                    Practice
                                </button>
                                <button
                                    type="button"
                                    className="w-full py-2 text-sm font-medium text-green-900 bg-green-100 border border-transparent rounded-md hover:bg-green-200 dark:text-green-100 dark:bg-green-500/20 dark:hover:bg-green-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-700 focus:ring-green-500"
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
