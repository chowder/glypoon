import GameState from "../classes/GameState"

const Answer = ({ text, isVisible, gameState }) => {
    let color = isVisible ?
        "bg-blue-200" :
        gameState === GameState.ENDED ?
            "bg-red-200" :
            "bg-gray-200"

    return (
        <div className={`rounded-md h-8 align-middle flex justify-center items-center ${color}`}>
            <p className='text-gray-800 font-medium truncate'>{isVisible || gameState === GameState.ENDED ? text : ""}</p>
        </div >
    )
}

export default Answer
