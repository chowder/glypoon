import { useStoreState } from 'easy-peasy'
import Answer from './Answer'

const Answers = () => {
    const answers = useStoreState(store => store.solution.answers)
    const currentAnswers = useStoreState(store => store.currentAnswers)

    const maxAnswerLength = Math.max(...answers.map((answer) => answer.length))
    const pangrams = answers.filter((answer) => answer.length === maxAnswerLength)

    // let pangram = answers.reduce((prev, current) => (prev.length > current.length) ? prev : current)
    return (
        <div className='answers-container w-full max-w-3xl h-auto lg:h-72 flex'>
            <div className='grid grid-cols-4 lg:grid-cols-6 grid-flow-row gap-x-2.5 md:gap-x-4 gap-y-2.5 p-6 w-full'>
                {answers.sort().map((answer, index) => (
                    <Answer
                        text={answer}
                        isVisible={currentAnswers.includes(answer)}
                        isPangram={pangrams.includes(answer)}
                        key={index}
                    />
                ))}
            </div>
        </div>
    )
}

export default Answers
