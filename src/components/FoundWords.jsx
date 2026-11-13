import { useStoreState } from 'easy-peasy'
import { ChevronUpIcon } from '@heroicons/react/solid'
import GameState from '../classes/GameState'

const FoundWords = ({ onClick }) => {
    const answers = useStoreState(store => store.solution.answers)
    const currentAnswers = useStoreState(store => store.currentAnswers)
    const gameState = useStoreState(store => store.gameState)

    const maxAnswerLength = Math.max(...answers.map((answer) => answer.length))
    const recentAnswers = [...currentAnswers].reverse()

    const getPlaceholder = () => {
        if (gameState === GameState.ENDED) {
            return "Tap to see the answers"
        }
        return "No words found yet"
    }

    return (
        <button
            type="button"
            className="found-words"
            onClick={onClick}
            aria-label={`Show all words, ${currentAnswers.length} found`}
        >
            <div className="flex flex-1 min-w-0 space-x-2 overflow-hidden [mask-image:linear-gradient(to_right,black_85%,transparent)]">
                {recentAnswers.length === 0 ?
                    <span className="truncate font-medium text-gray-400 dark:text-gray-400">{getPlaceholder()}</span> :
                    recentAnswers.map((answer) => (
                        <span
                            className={`found-word ${answer.length === maxAnswerLength ?
                                "bg-gradient-to-r from-yellow-400 to-yellow-200 dark:from-yellow-600 dark:to-yellow-500" :
                                "bg-blue-200 dark:bg-blue-500"}`}
                            key={answer}
                        >
                            {answer}
                        </span>
                    ))}
            </div>
            <ChevronUpIcon className="h-5 w-5 ml-2 flex-shrink-0 text-gray-400" />
        </button>
    )
}

export default FoundWords
