import Polygon from './Polygon'
import InputBox from './InputBox'
import Answers from './Answers'
import Score from './Score'
import Timer from './Timer'
import PuzzleHint from './PuzzleHint'
import Header from './Header'
import GameMenu from './GameMenu'
import ShuffleButton from './ShuffleButton'
import Welcome from './Welcome'
import Congratulations from './Congratulations'
import RevealDialog from './RevealDialog'
import GameState from '../classes/GameState'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { useMemo, useEffect } from 'react'
import NewGameDialog from './NewGameDialog'
import CompactGame from './CompactGame'


const Game = ({ compact, title, settings }) => {
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
            {compact ?
                <CompactGame title={title} settings={settings} /> :
                <div className="mx-auto lg:max-w-screen-lg p-4">
                    <div className="flex flex-col justify-center p-6 text-center space-y-8 items-start">
                        <div className="flex flex-row w-full items-center justify-between">
                            <Header title={title} />
                            <div className="flex flex-row items-center space-x-6">
                                <Timer />
                                <GameMenu settings={settings} />
                            </div>
                        </div>
                        <div className="w-full flex flex-row items-baseline justify-between">
                            <PuzzleHint />
                            <div className="px-2">
                                <Score />
                            </div>
                        </div>
                        <div className="flex w-full flex-col space-y-6 md:flex-row md:justify-start md:space-y-0 md:space-x-6 z-10">
                            <div className="flex flex-col space-y-6 items-center">
                                <div className="relative">
                                    <Polygon />
                                    <ShuffleButton
                                        className="icon-button absolute top-2 right-2 h-8 w-8 text-gray-400 dark:text-gray-400 disabled:opacity-40"
                                        iconClassName="h-5 w-5"
                                    />
                                </div>
                                <InputBox />
                            </div>
                            <Answers />
                        </div>
                    </div>
                </div>}
        </>
    )
}

export default Game
