import { useState } from 'react'
import PropTypes from 'prop-types'
import { useStoreActions, useStoreState } from 'easy-peasy'
import GameState from '../classes/GameState'


const InputBox = () => {
    const answers = useStoreState(store => store.solution.answers)
    const currentAnswers = useStoreState(store => store.currentAnswers)
    const currentInput = useStoreState(store => store.currentInput)
    const gameState = useStoreState(store => store.gameState)

    const submitAnswer = useStoreActions(actions => actions.submitAnswer)
    const setCurrentInput = useStoreActions(actions => actions.setCurrentInput)

    const [inputStyles, setInputStyles] = useState([])
    const [error, setError] = useState("")
    // const [showError, setShowError] = useState(false)

    const handleChange = (e) => {
        setCurrentInput(e.target.value)
    }

    const resetInputStyles = () => {
        setInputStyles([])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (currentInput) {
            let answer = currentInput.trim()
            if (answers.includes(answer) === true && currentAnswers.includes(answer) === false) {
                setInputStyles([...inputStyles, "ring-green-400 dark:ring-green-500", "animate-bounce"])
                submitAnswer(answer)
                setError("")
            } else {
                setInputStyles([...inputStyles, "ring-red-400 dark:ring-red-500", "animate-wiggle"])
                if (currentAnswers.includes(answer) === true) {
                    setError(`${answer} was already guessed`)
                } else {
                    setError(`${answer} was incorrect`)
                }
            }
        }
        setCurrentInput("")
    }

    return (
        <div className="w-72 mx-0">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder={gameState === GameState.RUNNING ? "Answer" : "Game over"}
                    value={gameState === GameState.RUNNING ? currentInput : ""}
                    className={`transition-all duration-300 ease-out input-box ${inputStyles.join(' ')}`}
                    onChange={handleChange}
                    onAnimationEnd={() => resetInputStyles()}
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    disabled={gameState !== GameState.RUNNING}
                />
            </form>
            <div className="h-4 mx-2 my-4">
                {error.length > 1 && <p className="text-left font-medium text-red-500 dark:text-red-400">{error}</p>}
            </div>
        </div>
    )
}

InputBox.propTypes = {
    onSubmit: PropTypes.func,  // This callback should return `true` if the submission was correct and `false` otherwise
    error: PropTypes.string
}

export default InputBox
