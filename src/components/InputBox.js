import GameState from '../classes/GameState'
import PropTypes from 'prop-types'
import { useState, useMemo, useRef, useEffect } from 'react'
import { useStoreActions, useStoreState } from 'easy-peasy'


const InputBox = () => {
    const letters = useStoreState(store => store.solution.letters)
    const currentInput = useStoreState(store => store.currentInput)
    const gameState = useStoreState(store => store.gameState)

    const submitAnswer = useStoreActions(actions => actions.submitAnswer)
    const setCurrentInput = useStoreActions(actions => actions.setCurrentInput)
    const recalculateLetterAvailability = useStoreActions(actions => actions.recalculateLetterAvailability)

    const inputBoxRef = useRef(null)
    const [inputStyles, setInputStyles] = useState([])
    const [error, setError] = useState("")

    useMemo(() => {
        if (gameState === GameState.RUNNING) {
            inputBoxRef.current.focus()
        }
    }, [gameState])

    const handleChange = (e) => {
        // TODO: Memoise this
        let countByLetters = {}
        letters.forEach((letter) => {
            if (letter in countByLetters) {
                countByLetters[letter]++
            } else {
                countByLetters[letter] = 1
            }
        })
        console.log({ countByLetters })
        for (let letter of e.target.value) {
            letter = letter.toLowerCase()
            if (letter in countByLetters && countByLetters[letter] > 0) {
                countByLetters[letter]--
            } else {
                return
            }
        }
        setCurrentInput(e.target.value)
        recalculateLetterAvailability()
    }

    const lastSubmissionResult = useStoreState(store => store.lastSubmissionResult)
    const lastSubmissionAnswer = useStoreState(store => store.lastSubmissionAnswer)

    useEffect(() => {
        if (lastSubmissionResult === true) {
            setError("")
            setInputStyles([...inputStyles, "input-box-correct"])
        } else if (lastSubmissionResult === false) {
            setError(`${lastSubmissionAnswer} was incorrect`)
            setInputStyles([...inputStyles, "input-box-wrong"])
        }
        // eslint-disable-next-line
    }, [lastSubmissionResult, lastSubmissionAnswer])

    const handleSubmit = (e) => {
        e.preventDefault()
        submitAnswer();
    }

    const resetInputStyles = () => {
        setInputStyles([])
    }

    return (
        <div className="w-72 mx-0">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Answer"
                    value={gameState === GameState.RUNNING ? currentInput : ""}
                    className={`transition-all input-box ${inputStyles.join(' ')}`}
                    onChange={handleChange}
                    onAnimationEnd={() => resetInputStyles()}
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    autoFocus={true}
                    disabled={gameState !== GameState.RUNNING && gameState !== GameState.PAUSED}
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
