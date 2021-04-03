import { useState, useEffect } from 'react'

// TODO: Use a proper datetime library here

const calculateTimeRemaining = (startTime, gameDuration) => {
    let endTime = startTime + gameDuration * 60000
    let secondsRemaining = Math.floor((endTime - Date.now()) / 1000)
    return Math.max(0, secondsRemaining)  // Don't go negative
}

const Timer = ({ startTime, gameDuration }) => {
    const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(startTime, gameDuration))

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(calculateTimeRemaining(startTime, gameDuration))
        }, 1000);
        return () => clearInterval(timer);
    }, [startTime, gameDuration])

    return (
        <div>
            <p className="text-xl font-semibold text-gray-900">
                <span className="mr-1.5">⌛</span>
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60) < 10 ? `0${timeRemaining % 60}` : timeRemaining % 60}
            </p>
        </div>
    )
}

export default Timer
