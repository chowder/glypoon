import PolygonLetter from './PolygonLetter'
import { useStoreState } from 'easy-peasy'


const polarToCartesian = (radians, distance) => {
    let x = Math.cos(radians) * distance
    let y = Math.sin(radians) * distance
    return [x, y]
}

const Polygon = () => {
    const letters = useStoreState(store => store.solution.letters)

    let angleBetweenElements = Math.PI * 2 / (letters.length - 1);

    return (
        <div className='flex-shrink-0 w-72 h-72 polygon' style={{ position: 'relative' }}>
            <PolygonLetter
                top={50} left={50}
                letter={letters[0]}
                index={0}
                key={0}
            />
            {letters.slice(1).map((element, index) => {
                let [x, y] = polarToCartesian(angleBetweenElements * index, 32);
                return <PolygonLetter
                    top={50 + x} left={50 + y}
                    letter={element}
                    index={index + 1}
                    key={index + 1}
                />
            })}
        </div>
    )
}

export default Polygon
