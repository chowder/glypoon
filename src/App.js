import './App.css';
import Header from './components/Header'
import Polygon from './components/Polygon'
import InputBox from './components/InputBox'
import Answers from './components/Answers'
import Score from './components/Score'
import Timer from './components/Timer'
import Welcome from './components/Welcome'
import GameState from './classes/GameState'
import { useState, useEffect } from 'react'

const GAME_DURATION = process.env.REACT_APP_GAME_DURATION | 10  // in seconds
const EXTRA_TIME_AMOUNT = process.env.REACT_APP_EXTRA_TIME_AMOUNT | 10  // in seconds

function App() {
  const [currentAnswers, setCurrentAnswers] = useState([])
  const [answers, setAnswers] = useState(null)
  const [letters, setLetters] = useState(null)
  const [gameState, setGameState] = useState(GameState.NOT_STARTED)
  const [secondsRemaining, setSecondsRemaining] = useState(GAME_DURATION)

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
      console.log(`${answer} has already been guessed!`)
      return
    }
    if (answers.includes(answer)) {
      console.log(`${answer} was a correct guess!`)
      setCurrentAnswers([...currentAnswers, answer])
    } else {
      console.log(`${answer} was an incorrect guess!`)
    }
  }

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
      {gameState === GameState.NOT_STARTED ? <Welcome gameDuration={GAME_DURATION} onStart={startGame} /> : <></>}
      <div className="w-full mx-auto xl:w-4/5 2xl:w-2/3 sm:p-6">
        <div className="flex flex-col w-full justify-center p-6 text-center space-y-8 items-start">
          <Header title={'Glypoon'} />
          <div className="w-full flex flex-col items-start space-y-4 px-2 lg:flex-row lg:justify-between lg:space-y-0">
            <Timer secondsRemaining={secondsRemaining} gameState={gameState} onClick={addMoreTime} />
            <Score currentScore={currentAnswers.length} totalScore={answers.length} />
          </div>
          <div className="flex w-full flex-col space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0">
            <Polygon letters={letters} gameStarted={gameState} />
            <Answers answers={answers} currentAnswers={currentAnswers} gameState={gameState} />
          </div>
          <InputBox onSubmit={submitAnswer} />
        </div>
      </div>
    </div>

  );
}

export default App;
