import { useState, useEffect } from 'react'

const DarkModeToggle = ({ onToggle, isChristmasMode }) => {
    const [toggleActive, setToggleActive] = useState(isChristmasMode)

    useEffect(() => {
        setToggleActive(isChristmasMode)
    }, [isChristmasMode])

    const handleClick = () => {
        setToggleActive(!toggleActive)
        onToggle()
    }

    return (
        <div className="flex flex-row space-x-3 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block text-red-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clip-rule="evenodd" />
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
            </svg>
            <div className={`w-10 h-6 flex items-center rounded-full p-1 duration-300 ease-out ${toggleActive ? "bg-green-400" : "bg-gray-300"}`} onClick={handleClick}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-out ${toggleActive ? "translate-x-4" : "translate-x-0"}`} />
            </div>
        </div>
    )
}

export default DarkModeToggle
