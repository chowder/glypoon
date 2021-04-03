const getGrade = (score) => {
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

const Score = ({ currentScore, totalScore }) => {
    let grade = getGrade(currentScore / totalScore)
    return (
        <div className="flex flex-row">
            {grade ? <p className="text-xl font-semibold mr-3">({grade})</p> : <></>}
            <p className="text-xl font-semibold">
                {currentScore} / {totalScore}
            </p>
        </div>
    )
}

export default Score
