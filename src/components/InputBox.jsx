import GameState from '../classes/GameState'
import PropTypes from 'prop-types'
import { useRef, useEffect, useMemo } from 'react'
import { useStoreActions, useStoreState } from 'easy-peasy'
import useSubmissionFeedback from '../hooks/useSubmissionFeedback'


const InputBox = () => {
    const letters = useStoreState(store => store.solution.letters)
    const currentInput = useStoreState(store => store.currentInput)
    const gameState = useStoreState(store => store.gameState)
    const inputFocusRequests = useStoreState(store => store.inputFocusRequests)

    const submitAnswer = useStoreActions(actions => actions.submitAnswer)
    const setCurrentInput = useStoreActions(actions => actions.setCurrentInput)
    const recalculateLetterAvailability = useStoreActions(actions => actions.recalculateLetterAvailability)

    const inputBoxRef = useRef(null)
    const { result, error, clearResult } = useSubmissionFeedback()

    useEffect(() => {
        if (gameState === GameState.RUNNING) {
            // Deferred so that it runs after any closing dialog has unmounted:
            // until then the dialog's focus trap would pull focus back into it.
            const timeout = setTimeout(() => inputBoxRef.current?.focus())
            return () => clearTimeout(timeout)
        }
    }, [gameState, inputFocusRequests])

    const countByLetters = useMemo(() => {
        let countByLetters = {}
        letters.forEach((letter) => {
            if (letter in countByLetters) {
                countByLetters[letter]++
            } else {
                countByLetters[letter] = 1
            }
        })
        return countByLetters
    }, [letters])

    const handleChange = (e) => {
        let _countByLetters = Object.assign({}, countByLetters)
        for (let letter of e.target.value) {
            letter = letter.toLowerCase()
            if (letter in _countByLetters && _countByLetters[letter] > 0) {
                _countByLetters[letter]--
            } else {
                return
            }
        }
        setCurrentInput(e.target.value)
        recalculateLetterAvailability()
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        submitAnswer();
    }

    const resultStyles = {
        correct: "input-box-correct",
        wrong: "input-box-wrong"
    }

    return (
        <div className="w-72 mx-0">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Answer"
                    value={gameState === GameState.RUNNING ? currentInput : ""}
                    className={`transition-all input-box ${resultStyles[result] || ""}`}
                    onChange={handleChange}
                    onAnimationEnd={clearResult}
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
                {error && <p className="text-left font-medium text-red-500 dark:text-red-400">{error}</p>}
            </div>
        </div>
    )
}

InputBox.propTypes = {
    onSubmit: PropTypes.func,  // This callback should return `true` if the submission was correct and `false` otherwise
    error: PropTypes.string
}

export default InputBox
