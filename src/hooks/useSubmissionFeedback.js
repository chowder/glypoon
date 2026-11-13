import { useState, useEffect } from 'react'
import { useStoreState } from 'easy-peasy'

const vibrate = (pattern) => {
    if (navigator.vibrate) {
        navigator.vibrate(pattern)
    }
}

const useSubmissionFeedback = () => {
    const currentAnswers = useStoreState(store => store.currentAnswers)
    const lastSubmissionResult = useStoreState(store => store.lastSubmissionResult)
    const lastSubmissionAnswer = useStoreState(store => store.lastSubmissionAnswer)
    const submissionCount = useStoreState(store => store.submissionCount)

    const [result, setResult] = useState(null)
    const [error, setError] = useState("")

    useEffect(() => {
        if (lastSubmissionResult === true) {
            setError("")
            setResult("correct")
            vibrate(15)
        } else if (lastSubmissionResult === false) {
            if (lastSubmissionAnswer.length === 0) {
                setError("")
            } else if (currentAnswers.includes(lastSubmissionAnswer)) {
                setError(`${lastSubmissionAnswer} was already guessed`)
            } else {
                setError(`${lastSubmissionAnswer} was incorrect`)
            }
            setResult("wrong")
            vibrate([30, 40, 30])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submissionCount])

    const clearResult = () => setResult(null)

    return { result, error, clearResult }
}

export default useSubmissionFeedback
