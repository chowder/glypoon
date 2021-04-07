const RevealConfirmation = ({ onQuit, onContinue }) => {
    return (
        <div className="popup-background flex justify-center items-center p-6">
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-sm sm:max-w-md">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="">
                        <div className="mt-3 text-center justify-center sm:mt-0">
                            <div className="mx-auto inline-flex flex-shrink-0 mb-4 items-center justify-center h-12 w-12 rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl leading-6 font-medium text-gray-900">
                                Chickening out?
                            </h3>
                            <div className="mt-3">
                                <p className="text-gray-600">
                                    Reveal the answers
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 flex flex-row space-x-3">
                    <button
                        className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-0 sm:text-sm"
                        onClick={onContinue}
                    >
                        Continue
                    </button>
                    <button
                        className="w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-0 sm:text-sm"
                        onClick={onQuit}
                    >
                        Chicken
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RevealConfirmation
