import PolygonLetter from './PolygonLetter'
import { useStoreState } from 'easy-peasy'
import GameState from '../classes/GameState'
import ShuffleButton from './ShuffleButton'


const Polygon = ({ className = 'w-72 h-72' }) => {
    const letters = useStoreState(store => store.solution.letters)
    const letterIds = useStoreState(store => store.letterIds)
    const gameState = useStoreState(store => store.gameState)

    const isOver = gameState === GameState.ENDED || gameState === GameState.COMPLETE

    let angleBetweenElements = 360 / (letters.length - 1);

    return (
        <div className={`flex-shrink-0 polygon transition-opacity duration-500 ${isOver ? "opacity-40" : ""} ${className}`} style={{ position: 'relative' }}>
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
            <ShuffleButton
                className="icon-button absolute top-2 right-2 h-8 w-8 text-gray-400 dark:text-gray-400 disabled:opacity-40"
                iconClassName="h-5 w-5"
            />
        </div>
    )
}

export default Polygon
