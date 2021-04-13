import { useStoreState } from 'easy-peasy';
import GameState from '../classes/GameState';
import PolygonLetter from './PolygonLetter'
import { useMemo } from 'react'


const polarToCartesian = (radians, distance) => {
    let x = Math.cos(radians) * distance;
    let y = Math.sin(radians) * distance;
    return [x, y]
}

const Polygon = () => {
    const gameState = useStoreState(store => store.gameState)
    const letters = useStoreState(store => store.solution.letters)

    const lettersToDisplay = useMemo(() => (
        gameState === GameState.PAUSED ?
            ['N', 'I', 'C', 'E', 'T', 'R', 'Y'] : // Cheaters beware!
            letters.map((letter) => letter.toUpperCase())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ), [letters, gameState])

    let angleBetweenElements = Math.PI * 2 / (lettersToDisplay.length - 1);

    return (
        <div className='flex-shrink-0 w-72 h-72 polygon' style={{ position: 'relative' }}>
            <PolygonLetter top={50} left={50} text={lettersToDisplay[0]} />
            {lettersToDisplay.slice(1).map((element, index) => {
                let [x, y] = polarToCartesian(angleBetweenElements * index, 32);
                return <PolygonLetter top={50 + x} left={50 + y} text={element} key={index} />
            })}
        </div>
    )
}

export default Polygon
