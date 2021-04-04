const Timer = ({ secondsRemaining }) => {
    return (
        <div>
            <p className="text-xl font-semibold text-gray-900">
                <span className="mr-1.5">⌛</span>
                {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60) < 10 ? `0${secondsRemaining % 60}` : secondsRemaining % 60}
            </p>
        </div>
    )
}

export default Timer
