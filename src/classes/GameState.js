const GameState = Object.freeze({
    PAUSED: Symbol("not started"),
    RUNNING: Symbol("started"),
    ENDED: Symbol("ended"),
    COMPLETE: Symbol("complete")
})

export default GameState
