import './App.css';
import Header from './components/Header'
import Polygon from './components/Polygon'
import InputBox from './components/InputBox'
import Answers from './components/Answers'
import { useState, useEffect } from 'react'

function App() {
  const [currentAnswers, setCurrentAnswers] = useState([])
  const [answers, setAnswers] = useState(null)
  const [letters, setLetters] = useState(null)

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

  if (answers === null || letters === null) {
    return <div>
      <p>Loading...</p>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-100 text-coolGray-800">
      <div className="w-full mx-auto 2xl:w-4/6 sm:p-8">
        <div className="flex flex-col justify-center p-6 text-center space-y-12 items-start">
          <Header title={'Glypoon'} />
          <div className="flex w-full flex-col space-y-12 lg:flex-row lg:space-x-12 lg:space-y-0">
            <Polygon letters={letters} />
            <Answers answers={answers} currentAnswers={currentAnswers} />
          </div>
          <InputBox onSubmit={submitAnswer} />
        </div>
      </div>
    </div>

  );
}

export default App;
