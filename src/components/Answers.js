import Answer from './Answer'

const Answers = ({ answers, currentAnswers }) => {
    return (
        <div className='w-full h-72 bg-white rounded-3xl shadow-md flex'>
            <div className='grid grid-cols-6 grid-rows-6 grid-flow-row gap-4 p-6 w-full'>
                {answers.sort().map((answer, index) => (
                    <Answer
                        text={answer}
                        isVisible={currentAnswers.includes(answer)}
                        key={index}
                    />
                ))}
            </div>
        </div>
    )
}

export default Answers
