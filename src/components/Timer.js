import { useState, useEffect } from 'react'

const calculateTimeRemaining = (startTime, gameDuration) => {
    let endTime = startTime + gameDuration * 60000
    return Math.floor((endTime - Date.now()) / 1000)
}

const Timer = ({ startTime, gameDuration }) => {
    const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(startTime, gameDuration))

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeRemaining(Math.max(timeRemaining - 1, 0))
        }, 1000);
        return () => clearTimeout(timer);
    })

    return (
        <div>
            <p className="text-xl font-semibold">
                <span className="mr-1.5">⌛</span>
                {/* TODO: Use a proper datetime library */}
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60) < 10 ? `0${timeRemaining % 60}` : timeRemaining % 60}
            </p>
        </div>
    )
}

export default Timer
