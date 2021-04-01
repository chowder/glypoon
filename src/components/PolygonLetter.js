const PolygonLetter = ({ top, left, text }) => {
    return (
        <p
            className='text-4xl glypoon-cell font-medium text-gray-800'
            style={{ margin: 'auto', position: 'absolute', top: `${top}%`, left: `${left}%` }}>
            {text}
        </p>
    )
}

export default PolygonLetter
