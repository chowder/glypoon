import { useState, useEffect } from 'react'

const DarkModeToggle = ({ onToggle, isDarkMode }) => {
    const [toggleActive, setToggleActive] = useState(isDarkMode)

    useEffect(() => {
        setToggleActive(isDarkMode)
    }, [isDarkMode])

    const handleClick = () => {
        setToggleActive(!toggleActive)
        onToggle()
    }

    return (
        <div className="flex flex-row space-x-3 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block text-yellow-400 dark:text-yellow-200 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <div className={`w-10 h-6 flex items-center rounded-full p-1 duration-300 ease-out ${toggleActive ? "bg-green-400" : "bg-gray-300"}`} onClick={handleClick}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-out ${toggleActive ? "translate-x-4" : "translate-x-0"}`} />
            </div>
        </div>
    )
}

export default DarkModeToggle
