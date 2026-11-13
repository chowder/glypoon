import PolygonLetter from './PolygonLetter'
import { useStoreState } from 'easy-peasy'


const Polygon = ({ className = 'w-72 h-72' }) => {
    const letters = useStoreState(store => store.solution.letters)
    const letterIds = useStoreState(store => store.letterIds)

    let angleBetweenElements = 360 / (letters.length - 1);

    return (
        <div className={`flex-shrink-0 polygon ${className}`} style={{ position: 'relative' }}>
            <PolygonLetter
                angle={0} radius={0}
                letter={letters[0]}
                index={0}
                key={letterIds[0]}
            />
            {letters.slice(1).map((element, index) => {
                return <PolygonLetter
                    angle={90 - angleBetweenElements * index} radius={32}
                    letter={element}
                    index={index + 1}
                    key={letterIds[index + 1]}
                />
            })}
        </div>
    )
}

export default Polygon
