import { useState } from 'react'


const InputBox = ({ onSubmit }) => {
    const [answer, setAnswer] = useState("")

    const handleChange = (e) => {
        setAnswer(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (answer) {
            onSubmit(answer.toLowerCase())
            setAnswer("")
        }
    }

    return (
        <div className="w-72">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Answer"
                    value={answer}
                    className="px-5 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded-xl text-base border-0 shadow-md outline-none focus:outline-none focus:ring w-full"
                    onChange={handleChange}
                />
            </form>
        </div>
    )
}

export default InputBox
