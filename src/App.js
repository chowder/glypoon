import './App.css';
import Header from './components/Header'
import Polygon from './components/Polygon'
import InputBox from './components/InputBox'
import Answers from './components/Answers'
import Score from './components/Score'
import Timer from './components/Timer'
import Welcome from './components/Welcome'
import Congratulations from './components/Congratulations'
import GameState from './classes/GameState'
import { useState, useEffect } from 'react'
import PuzzleHint from './components/PuzzleHint';
import RevealButton from './components/RevealButton';
import RevealConfirmation from './components/RevealConfirmation';

const GAME_DURATION = parseInt((process.env.REACT_APP_GAME_DURATION | "10"))  // in seconds
const EXTRA_TIME_AMOUNT = parseInt((process.env.REACT_APP_EXTRA_TIME_AMOUNT | "10"))  // in seconds

function App() {
  const [currentAnswers, setCurrentAnswers] = useState([])
  const [answers, setAnswers] = useState(null)
  const [letters, setLetters] = useState(null)
  const [gameState, setGameState] = useState(GameState.PAUSED)
  const [secondsRemaining, setSecondsRemaining] = useState(GAME_DURATION)
  const [showRevealConfirmation, setShowRevealConfirmation] = useState(false)
  const [error, setError] = useState()

  // Fetching the puzzle
  const fetchPuzzle = async () => {
    const res = await fetch('/puzzle/puzzle.json')
    const data = await res.json()
    return data;
  }

  useEffect(() => {
    const getPuzzle = async () => {
      const puzzle = await fetchPuzzle()
      setAnswers(puzzle.answers)
      setLetters(puzzle.letters)
    }

    getPuzzle()
  }, [])

  // Submitting an answer
  const submitAnswer = (answer) => {
    answer = answer.trim()
    if (currentAnswers.includes(answer)) {
      setError(`${answer} was already guessed`)
      return false;
    }
    if (answers.includes(answer)) {
      setCurrentAnswers([...currentAnswers, answer])
      return true;
    } else {
      setError(`${answer} was incorrect`)
      return false;
    }
  }

  // Check if all answers have been guessed
  useEffect(() => {
    if (answers !== null) {
      var answersSet = new Set(answers);
      var currentAnswersSet = new Set(currentAnswers)
      // Size checks probably sufficient... but who knows what I might mess up later
      if (answersSet.size === currentAnswersSet.size && [...answersSet].every(value => currentAnswersSet.has(value))) {
        setGameState(GameState.COMPLETE);
      }
    }
  }, [answers, currentAnswers])

  // Count down the timer
  useEffect(() => {
    if (gameState === GameState.RUNNING) {
      const timer = setInterval(() => {
        if (secondsRemaining === 0) {
          setGameState(GameState.ENDED)
        } else {
          setSecondsRemaining(secondsRemaining - 1)
        }
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameState, secondsRemaining])

  /* Callbacks */

  const startGame = () => {
    setGameState(GameState.RUNNING)
    setSecondsRemaining(GAME_DURATION)
  }

  const continueGame = () => {
    setShowRevealConfirmation(false)
  }

  const quitGame = () => {
    setShowRevealConfirmation(false)
    setGameState(GameState.ENDED)
  }

  const addMoreTime = () => {
    if (gameState === GameState.RUNNING) {
      setSecondsRemaining(previous => previous + EXTRA_TIME_AMOUNT)
    }
  }

  if (answers === null || letters === null) {
    return <div>
      <p>Loading...</p>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-100 text-coolGray-800">
      {gameState === GameState.PAUSED &&
        <Welcome gameDuration={GAME_DURATION} onStart={startGame} />}
      {gameState === GameState.COMPLETE &&
        <Congratulations secondsRemaining={secondsRemaining} />}
      {showRevealConfirmation &&
        <RevealConfirmation
          onContinue={continueGame}
          onQuit={quitGame}
        />}
      <div className="mx-auto lg:max-w-screen-lg p-4">
        <div className="flex flex-col justify-center p-6 text-center space-y-8 items-start">
          <Header title={'Glypoon'} />
          <div className="w-full flex flex-row justify-between items-center">
            <PuzzleHint answers={answers} />
            <RevealButton gameState={gameState} onClick={() => setShowRevealConfirmation(true)} />
          </div>
          <div className="w-full flex px-2 flex-row justify-between space-y-0">
            <Timer secondsRemaining={secondsRemaining} gameState={gameState} onClick={addMoreTime} />
            <Score currentScore={currentAnswers.length} totalScore={answers.length} />
          </div>
          <div className="flex w-full flex-col space-y-6 md:flex-row md:justify-start md:space-y-0 md:space-x-6">
            <div className="flex flex-col space-y-6 items-center">
              <Polygon letters={letters} gameState={gameState} />
              <InputBox onSubmit={submitAnswer} error={error} />
            </div>
            <Answers answers={answers} currentAnswers={currentAnswers} gameState={gameState} />
          </div>
        </div>
      </div>
    </div>

  );
}

export default App;