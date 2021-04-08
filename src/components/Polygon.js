import GameState from '../classes/GameState';
import PolygonLetter from './PolygonLetter'

const polarToCartesian = (radians, distance) => {
    let x = Math.cos(radians) * distance;
    let y = Math.sin(radians) * distance;
    return [x, y]
}

const Polygon = ({ letters, gameState }) => {
    letters = gameState === GameState.PAUSED ?
        ['N', 'I', 'C', 'E', 'T', 'R', 'Y'] : // Cheaters beware!
        letters.map((letter) => letter.toUpperCase())

    let angleBetweenElements = Math.PI * 2 / (letters.length - 1);

    return (
        <div className='flex-shrink-0 w-72 h-72 bg-white rounded-3xl shadow-md' style={{ position: 'relative' }}>
            <PolygonLetter top={50} left={50} text={letters[0]} />
            {letters.slice(1).map((element, index) => {
                let [x, y] = polarToCartesian(angleBetweenElements * index, 32);
                return <PolygonLetter top={50 + x} left={50 + y} text={element} key={index} />
            })}
        </div>
    )
}

export default Polygon
