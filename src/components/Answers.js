import Answer from './Answer'

const Answers = ({ answers, currentAnswers, gameState }) => {
    let pangram = answers.reduce((prev, current) => (prev.length > current.length) ? prev : current)
    return (
        <div className='w-full max-w-3xl h-auto lg:h-72 bg-white rounded-3xl shadow-md flex'>
            <div className='grid grid-cols-4 lg:grid-cols-6 grid-flow-row gap-x-2.5 md:gap-x-4 gap-y-2.5 p-6 w-full'>
                {answers.sort().map((answer, index) => (
                    <Answer
                        text={answer}
                        isVisible={currentAnswers.includes(answer)}
                        isPangram={answer === pangram}
                        gameState={gameState}
                        key={index}
                    />
                ))}
            </div>
        </div>
    )
}

export default Answers
