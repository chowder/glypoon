import { useStoreActions, useStoreState } from "easy-peasy"
import GameState from "../classes/GameState"
import React, { useEffect } from 'react'


const Timer = () => {
    const secondsRemaining = useStoreState(store => store.secondsRemaining)
    const gameState = useStoreState(store => store.gameState)
    const revealConfirmationVisible = useStoreState(store => store.revealConfirmationVisible)
    const progressTimer = useStoreActions(actions => actions.progressTimer)
    const addExtraTime = useStoreActions(actions => actions.addExtraTime)

    useEffect(() => {
        if (gameState === GameState.RUNNING && revealConfirmationVisible === false) {
            const timer = setInterval(() => {
                progressTimer()
            }, 1000)
            return () => clearInterval(timer)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState, revealConfirmationVisible])

    return (
        <div>
            <p className="timer">
                <span
                    className={`mr-3.5 ${gameState === GameState.RUNNING && "spinner"}`}
                    onClick={addExtraTime}>
                    ⌛
                </span>
                {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60) < 10 ? `0${secondsRemaining % 60}` : secondsRemaining % 60}
            </p>
        </div>
    )
}

export default Timer
