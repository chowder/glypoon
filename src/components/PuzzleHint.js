import { useStoreState } from 'easy-peasy'
import React from 'react'

const PuzzleHint = () => {
    const answers = useStoreState(store => store.solution.answers)
    return (
        <div className="px-2">
            <p className="text-lg font-medium text-gray-900 text-left">
                Find all {Math.min(...answers.map((answer) => answer.length))}+ letter words
            </p>
        </div>
    )
}

export default PuzzleHint
