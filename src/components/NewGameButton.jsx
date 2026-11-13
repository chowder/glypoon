import { useStoreActions } from 'easy-peasy'

const NewGameButton = () => {
    const showNewGameDialog = useStoreActions(actions => actions.showNewGameDialog)

    return (
        <button
            className="reveal-button h-9 w-28 mr-4"
            onClick={() => showNewGameDialog()}
        >
            New Game
        </button>
    )
}

export default NewGameButton
