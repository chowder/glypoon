import { useStoreActions, useStoreState } from 'easy-peasy'
import { useState, useEffect } from 'react'
import Header from './Header'
import Timer from './Timer'
import GameMenu from './GameMenu'
import Progress from './Progress'
import FoundWords from './FoundWords'
import CurrentWord from './CurrentWord'
import Polygon from './Polygon'
import Controls from './Controls'
import AnswersSheet from './AnswersSheet'
import GameState from '../classes/GameState'

const CompactGame = ({ title, settings }) => {
    const currentInput = useStoreState(store => store.currentInput)
    const gameState = useStoreState(store => store.gameState)
    const typeLetter = useStoreActions(actions => actions.typeLetter)
    const deleteLetter = useStoreActions(actions => actions.deleteLetter)
    const submitAnswer = useStoreActions(actions => actions.submitAnswer)

    const [answersVisible, setAnswersVisible] = useState(false)

    useEffect(() => {
        if (gameState === GameState.ENDED) {
            const timeout = setTimeout(() => setAnswersVisible(true), 800)
            return () => clearTimeout(timeout)
        }
    }, [gameState])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameState !== GameState.RUNNING || e.metaKey || e.ctrlKey || e.altKey) {
                return
            }
            if (e.target.closest && e.target.closest('[role="menu"], [role="dialog"]')) {
                return
            }
            if (/^[a-z]$/i.test(e.key)) {
                e.preventDefault()
                typeLetter(e.key.toLowerCase())
            } else if (e.key === 'Backspace') {
                e.preventDefault()
                deleteLetter()
            } else if (e.key === 'Enter') {
                e.preventDefault()
                if (currentInput.length > 0) {
                    submitAnswer()
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState, currentInput])

    return (
        <div className="flex flex-col h-[100dvh] max-w-md mx-auto space-y-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="flex flex-row items-center justify-between">
                <Header title={title} className="compact-header" />
                <div className="flex flex-row items-center space-x-2">
                    <Timer />
                    <GameMenu settings={settings} />
                </div>
            </div>
            <Progress />
            <FoundWords onClick={() => setAnswersVisible(true)} />
            <CurrentWord />
            <div className="flex flex-1 min-h-0 w-full items-center justify-center [container-type:size]">
                <Polygon className="w-[min(100cqw,100cqh,24rem)] h-[min(100cqw,100cqh,24rem)]" />
            </div>
            <Controls onShowAnswers={() => setAnswersVisible(true)} />
            <AnswersSheet open={answersVisible} onClose={() => setAnswersVisible(false)} />
        </div>
    )
}

export default CompactGame
