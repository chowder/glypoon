import { useStoreState } from 'easy-peasy'
import { getScoreDescription } from './Score'

const Progress = () => {
    const answers = useStoreState(store => store.solution.answers)
    const currentScore = useStoreState(store => store.currentAnswers.length)
    const totalScore = answers.length

    const ratio = totalScore > 0 ? currentScore / totalScore : 0
    const description = getScoreDescription(ratio)
    const minLength = Math.min(...answers.map((answer) => answer.length))

    return (
        <div className="w-full">
            <div className="flex flex-row items-baseline justify-between mb-2">
                <p className="score">
                    {currentScore} / {totalScore}
                    {description && <span className="ml-2 text-base font-medium text-gray-500 dark:text-gray-300">{description}</span>}
                </p>
                {totalScore > 0 && <p className="puzzle-hint text-base">{minLength}+ letter words</p>}
            </div>
            <div
                className="progress-track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={totalScore}
                aria-valuenow={currentScore}
            >
                <div className="progress-bar" style={{ width: `${ratio * 100}%` }} />
            </div>
        </div>
    )
}

export default Progress
