import './App.css';
import Header from './components/Header'
import Polygon from './components/Polygon'
import InputBox from './components/InputBox'
import Answers from './components/Answers'
import { useState } from 'react'

function App() {
  const answers = ['keystroke', 'stroke', 'stoke', 'restoke', 'oyster', 'rosety', 'steery', 'stereo']

  const letters = ['O', 'E', 'S', 'K', 'E', 'T', 'K', 'Y', 'R']

  const [currentAnswers, setCurrentAnswers] = useState([])

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

  return (
    <div className="min-h-screen bg-gray-100 text-coolGray-800">
      <div className="w-full md:w-4/6 mx-auto p-8">
        <div className="flex flex-col justify-center p-6 text-center space-y-12 items-start">
          <Header title={'Glypoon'} />
          <div className="flex space-x-12 w-full">
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
