const PolygonLetter = ({ top, left, text }) => {
    return (
        <div className='glypoon-cell bg-gray-200 flex items-center justify-center h-16 w-16 rounded-full shadow'
            style={{ margin: 'auto', position: 'absolute', top: `${top}%`, left: `${left}%` }}>
            <p className='text-4xl font-bold text-gray-800'>
                {text}
            </p>
        </div>
    )
}

export default PolygonLetter
