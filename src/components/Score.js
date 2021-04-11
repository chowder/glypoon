import { useStoreState } from "easy-peasy"

const getScoreDescription = (score) => {
    if (score <= 0.25) {
        return undefined
    } else if (score <= 0.50) {
        return "Average"
    } else if (score <= 0.75) {
        return "Good"
    } else {
        return "Very good"
    }
}

const Score = () => {
    const currentScore = useStoreState(store => store.currentAnswers.length)
    const totalScore = useStoreState(store => store.solution.answers.length)

    let description = getScoreDescription(currentScore / totalScore)
    return (
        <div className="flex flex-row">
            {description && <p className="score-description">({description})</p>}
            <p className="score">
                {currentScore} / {totalScore}
            </p>
        </div>
    )
}

export default Score
