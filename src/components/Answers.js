import Answer from './Answer'

const Answers = ({ answers, currentAnswers }) => {
    return (
        <div className='w-full max-w-3xl h-full lg:h-72 bg-white rounded-3xl shadow-md flex'>
            <div className='grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 grid-rows-6 grid-flow-row gap-4 p-6 w-full'>
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
