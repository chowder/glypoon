import GameState from "../classes/GameState"

const Timer = ({ secondsRemaining, gameState, onClick }) => {
    return (
        <div>
            <p className="text-xl font-semibold text-gray-900">
                <span
                    className={`mr-3.5 ${gameState === GameState.RUNNING ? "spinner" : ""}`}
                    onClick={onClick}>
                    ⌛
                </span>
                {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60) < 10 ? `0${secondsRemaining % 60}` : secondsRemaining % 60}
            </p>
        </div>
    )
}

export default Timer
