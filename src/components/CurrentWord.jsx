import { useStoreActions, useStoreState } from 'easy-peasy'
import { BackspaceIcon } from '@heroicons/react/solid'
import { useEffect } from 'react'
import GameState from '../classes/GameState'
import useSubmissionFeedback from '../hooks/useSubmissionFeedback'

const placeholders = new Map([
    [GameState.RUNNING, "Tap the letters"],
    [GameState.PAUSED, "Paused"],
    [GameState.ENDED, "Time's up"],
    [GameState.COMPLETE, "All words found!"]
])

const resultStyles = {
    correct: "current-word-correct",
    wrong: "current-word-wrong"
}

const getWordSize = (length) => {
    if (length <= 6) {
        return "text-4xl"
    } else if (length <= 8) {
        return "text-3xl"
    } else {
        return "text-2xl"
    }
}

const CurrentWord = () => {
    const currentInput = useStoreState(store => store.currentInput)
    const gameState = useStoreState(store => store.gameState)
    const lastSubmissionAnswer = useStoreState(store => store.lastSubmissionAnswer)
    const deleteLetter = useStoreActions(actions => actions.deleteLetter)
    const { result, error, clearResult } = useSubmissionFeedback()

    useEffect(() => {
        if (result) {
            const timeout = setTimeout(clearResult, 700)
            return () => clearTimeout(timeout)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result])

    const showResult = result && currentInput.length === 0 && lastSubmissionAnswer.length > 0
    const word = showResult ? lastSubmissionAnswer : currentInput

    return (
        <div className="flex flex-col items-center w-full" aria-live="polite">
            <div className="relative flex items-center justify-center h-12 w-full px-12">
                {word.length > 0 ?
                    <p className={`current-word ${getWordSize(word.length)} ${showResult ? resultStyles[result] : ""}`}>{word.toUpperCase()}</p> :
                    <p className="current-word-placeholder">{placeholders.get(gameState) || ""}</p>}
                {gameState === GameState.RUNNING && currentInput.length > 0 &&
                    <button
                        type="button"
                        className="icon-button absolute right-0 h-12 w-12"
                        onClick={() => deleteLetter()}
                        aria-label="Delete letter"
                    >
                        <BackspaceIcon className="h-7 w-7" />
                    </button>}
            </div>
            <div className="h-5">
                {error && <p className="text-sm font-medium text-red-500 dark:text-red-400">{error}</p>}
            </div>
        </div>
    )
}

export default CurrentWord
