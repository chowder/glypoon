const GameState = Object.freeze({
    NOT_STARTED: Symbol("not started"),
    PAUSED: Symbol("paused"),
    RUNNING: Symbol("started"),
    ENDED: Symbol("ended"),
    COMPLETE: Symbol("complete")
})

export default GameState
