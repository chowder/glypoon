import React from 'react'

const PuzzleHint = ({ answers }) => {
    let minLength = Math.min(...answers.map((answer) => answer.length))
    return (
        <div className="px-2">
            <p className="text-lg font-medium text-gray-900 text-left">
                Find all {minLength}+ letter words
            </p>
        </div>
    )
}

export default PuzzleHint
