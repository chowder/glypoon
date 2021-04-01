const Answer = ({ text, isVisible }) => {
    return (
        <div className={`rounded-md h-8 align-middle flex justify-center items-center ${isVisible ? "bg-blue-100" : "bg-gray-200"}`}>
            <p className='text-gray-800 font-medium truncate'>{isVisible ? text : ""}</p>
        </div >
    )
}

export default Answer
