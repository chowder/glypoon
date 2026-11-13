import { useStoreState } from 'easy-peasy'
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/solid'
import Answers from './Answers'
import GameState from '../classes/GameState'

const AnswersSheet = ({ open, onClose }) => {
    const currentScore = useStoreState(store => store.currentAnswers.length)
    const totalScore = useStoreState(store => store.solution.answers.length)
    const gameState = useStoreState(store => store.gameState)

    return (
        <Transition show={open} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10"
                open={open}
                onClose={onClose}
            >
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
                    enterFrom="translate-y-full"
                    enterTo="translate-y-0"
                    leave="ease-in duration-200"
                    leaveFrom="translate-y-0"
                    leaveTo="translate-y-full"
                >
                    <div className="sheet transform transition-transform">
                        <div className="flex flex-row items-center justify-between px-6 pt-5">
                            <Dialog.Title
                                as="h3"
                                className="text-xl font-semibold text-gray-900 dark:text-gray-50"
                            >
                                Words {currentScore} / {totalScore}
                            </Dialog.Title>
                            <button
                                type="button"
                                className="icon-button -mr-2"
                                onClick={onClose}
                                aria-label="Close"
                            >
                                <XIcon className="h-6 w-6" />
                            </button>
                        </div>
                        {gameState === GameState.ENDED &&
                            <div className="flex flex-row items-center space-x-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                                <span className="flex items-center">
                                    <span className="mr-2 h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-500" />
                                    Found
                                </span>
                                <span className="flex items-center">
                                    <span className="mr-2 h-3 w-3 rounded-sm bg-red-200 dark:bg-red-800" />
                                    Missed
                                </span>
                            </div>}
                        <div className="overflow-y-auto">
                            <Answers className="w-full" />
                        </div>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    )
}

export default AnswersSheet
