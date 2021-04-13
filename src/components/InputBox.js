import { useState, useEffect, useRef } from 'react'
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

    const inputBoxRef = useRef(null)
    const [inputStyles, setInputStyles] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        if (gameState === GameState.RUNNING) {
            inputBoxRef.current.focus()
        }
    }, [gameState])

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
                setInputStyles([...inputStyles, "input-box-correct"])
                submitAnswer(answer)
                setError("")
            } else {
                setInputStyles([...inputStyles, "input-box-wrong"])
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
                    className={`transition-all input-box ${inputStyles.join(' ')}`}
                    onChange={handleChange}
                    onAnimationEnd={() => resetInputStyles()}
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    autoFocus="true"
                    disabled={gameState !== GameState.RUNNING}
                    ref={inputBoxRef}
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
