import { useStoreActions, useStoreState } from 'easy-peasy'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { DotsVerticalIcon } from '@heroicons/react/solid'
import GameState from '../classes/GameState'

const GameMenu = ({ settings }) => {
    const gameState = useStoreState(store => store.gameState)
    const showNewGameDialog = useStoreActions(actions => actions.showNewGameDialog)
    const showRevealConfirmation = useStoreActions(actions => actions.showRevealConfirmation)
    const requestInputFocus = useStoreActions(actions => actions.requestInputFocus)

    const isRunning = gameState === GameState.RUNNING

    return (
        <Menu as="div" className="relative">
            <Menu.Button className="icon-button -mr-2" aria-label="Menu">
                <DotsVerticalIcon className="h-6 w-6" />
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                afterLeave={() => requestInputFocus()}
            >
                <Menu.Items className="menu-items">
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                type="button"
                                className={`menu-item ${active ? "bg-gray-100 dark:bg-gray-600" : ""}`}
                                onClick={() => showNewGameDialog()}
                            >
                                New game
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item disabled={!isRunning}>
                        {({ active }) => (
                            <button
                                type="button"
                                className={`menu-item ${active ? "bg-gray-100 dark:bg-gray-600" : ""}`}
                                onClick={() => showRevealConfirmation()}
                                disabled={!isRunning}
                            >
                                Show solution
                            </button>
                        )}
                    </Menu.Item>
                    <div className="my-2 border-t border-gray-200 dark:border-gray-600" />
                    <div className="flex flex-col space-y-4 px-4 py-2">
                        {settings}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

export default GameMenu
