import { useState } from 'react'
import PropTypes from 'prop-types'


const InputBox = ({ onSubmit, error }) => {
    const [answer, setAnswer] = useState("")
    const [inputStyles, setInputStyles] = useState([])
    const [showError, setShowError] = useState(false)

    const handleChange = (e) => {
        setAnswer(e.target.value)
    }

    const resetInput = () => {
        setInputStyles([])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (answer) {
            setAnswer("")
            if (onSubmit(answer.toLowerCase()) === false) {
                setInputStyles([...inputStyles, "ring-red-400", "animate-wiggle"])
                setShowError(true)
            } else {
                setInputStyles([...inputStyles, "ring-green-500", "animate-bounce"])
                setShowError(false);
            }
        }
    }

    return (
        <div className="w-72 mx-0">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Answer"
                    value={answer}
                    className={`${inputStyles.join(' ')} transition duration-200 ease-out px-5 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded-xl text-base border-0 shadow-md outline-none focus:outline-none focus:ring w-full`}
                    onChange={handleChange}
                    onAnimationEnd={() => resetInput()}
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                />
            </form>
            <div className="h-4 mx-2 my-4">
                {showError && <p className="text-md text-red-500 text-left font-medium">{error}</p>}
            </div>
        </div>
    )
}

InputBox.propTypes = {
    onSubmit: PropTypes.func,  // This callback should return `true` if the submission was correct and `false` otherwise
    error: PropTypes.string
}

export default InputBox
