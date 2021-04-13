import Polygon from './Polygon'
import InputBox from './InputBox'
import Answers from './Answers'
import Score from './Score'
import Timer from './Timer'
import PuzzleHint from './PuzzleHint'
import RevealButton from './RevealButton'
import Welcome from './Welcome'
import Congratulations from './Congratulations'
import RevealConfirmation from './RevealConfirmation'
import GameState from '../classes/GameState'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { useMemo, useEffect } from 'react'


const Game = () => {
    // Fetching the puzzle
    const fetchSolution = useStoreActions(actions => actions.fetchSolution)

    useEffect(() => {
        fetchSolution()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Check if game is complete
    const answers = useStoreState(state => state.solution.answers)
    const currentAnswers = useStoreState(state => state.currentAnswers)
    const setGameState = useStoreActions(actions => actions.setGameState)

    useMemo(() => {
        if (answers.length !== 0) {
            var answersSet = new Set(answers);
            var currentAnswersSet = new Set(currentAnswers)
            // Size checks probably sufficient... but who knows what I might mess up later
            if (answersSet.size === currentAnswersSet.size && [...answersSet].every(value => currentAnswersSet.has(value))) {
                setGameState(GameState.COMPLETE);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAnswers])

    return (
        <>
            <Welcome />
            <Congratulations />
            <RevealConfirmation />
            <div className="w-full flex flex-row justify-between items-center">
                <PuzzleHint />
                <RevealButton />
            </div>
            <div className="w-full flex px-2 flex-row justify-between space-y-0">
                <Timer />
                <Score />
            </div>
            <div className="flex w-full flex-col space-y-6 md:flex-row md:justify-start md:space-y-0 md:space-x-6">
                <div className="flex flex-col space-y-6 items-center">
                    <Polygon />
                    <InputBox />
                </div>
                <Answers />
            </div>
        </>
    )
}

export default Game
