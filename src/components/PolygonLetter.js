const PolygonLetter = ({ top, left, text }) => {
    return (
        <div className='glypoon-cell polygon-letter-bg flex items-center justify-center h-16 w-16'
            style={{ margin: 'auto', position: 'absolute', top: `${top}%`, left: `${left}%` }}>
            <p className='polygon-letter-text'>
                {text}
            </p>
        </div>
    )
}

export default PolygonLetter
