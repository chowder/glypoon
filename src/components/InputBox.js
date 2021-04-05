import { useState } from 'react'
import PropTypes from 'prop-types'


const InputBox = ({ onSubmit }) => {
    const [answer, setAnswer] = useState("")
    const [wiggleEffect, setWiggleEffect] = useState(false)

    const handleChange = (e) => {
        setAnswer(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (answer) {
            setAnswer("")
            if (onSubmit(answer.toLowerCase()) === false) {
                setWiggleEffect(true);
            }
        }
    }

    return (
        <div className="w-72">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Answer"
                    value={answer}
                    className={`${wiggleEffect && "animate-wiggle"} px-5 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded-xl text-base border-0 shadow-md outline-none focus:outline-none focus:ring w-full`}
                    onChange={handleChange}
                    onAnimationEnd={() => setWiggleEffect(false)}
                />
            </form>
        </div>
    )
}

InputBox.propTypes = {
    onSubmit: PropTypes.func  // This callback should return `true` if the submission was correct and `false` otherwise
}

export default InputBox
