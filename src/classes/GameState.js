const GameState = Object.freeze({
    NOT_STARTED: Symbol("not started"),
    RUNNING: Symbol("started"),
    ENDED: Symbol("ended")
})

export default GameState
