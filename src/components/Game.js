import Polygon from './Polygon'
import InputBox from './InputBox'
import Answers from './Answers'
import Score from './Score'
import Timer from './Timer'
import PuzzleHint from './PuzzleHint'
import RevealButton from './RevealButton'
import NewGameButton from './NewGameButton'
import Welcome from './Welcome'
import Congratulations from './Congratulations'
import RevealDialog from './RevealDialog'
import GameState from '../classes/GameState'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { useMemo, useEffect } from 'react'
import NewGameDialog from './NewGameDialog'


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
            <RevealDialog />
            <NewGameDialog />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:w-full">
                <PuzzleHint />
                <div className="mt-4 sm:mt-0">
                    <NewGameButton />
                    <RevealButton />
                </div>
            </div>
            <div className="w-full flex px-2 flex-row justify-between space-y-0">
                <Timer />
                <Score />
            </div>
            <div className="flex w-full flex-col space-y-6 md:flex-row md:justify-start md:space-y-0 md:space-x-6 z-10">
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
