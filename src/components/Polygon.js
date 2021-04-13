import PolygonLetter from './PolygonLetter'
import { useStoreState } from 'easy-peasy'
import { useMemo } from 'react'


const polarToCartesian = (radians, distance) => {
    let x = Math.cos(radians) * distance
    let y = Math.sin(radians) * distance
    return [x, y]
}

const Polygon = () => {
    const letters = useStoreState(store => store.solution.letters)
    const currentInput = useStoreState(store => store.currentInput)

    const letterAvailability = useMemo(() => {
        let inputLetterCount = {}
        for (var i = 0; i < currentInput.length; i++) {
            let l = currentInput[i].toLowerCase()
            if (l in inputLetterCount) {
                inputLetterCount[l]++
            } else {
                inputLetterCount[l] = 1
            }
        }
        let result = letters.map((l) => {
            if (l in inputLetterCount && inputLetterCount[l] > 0) {
                inputLetterCount[l]--
                return false;
            } else {
                return true;
            }
        })
        return result;
    }, [letters, currentInput])

    let angleBetweenElements = Math.PI * 2 / (letters.length - 1);

    return (
        <div className='flex-shrink-0 w-72 h-72 polygon' style={{ position: 'relative' }}>
            <PolygonLetter
                top={50} left={50}
                letter={letters[0]}
                isActive={letterAvailability[0]}
                index={0}
                key={0}
            />
            {letters.slice(1).map((element, index) => {
                let [x, y] = polarToCartesian(angleBetweenElements * index, 32);
                return <PolygonLetter
                    top={50 + x} left={50 + y}
                    letter={element}
                    isActive={letterAvailability[index + 1]}
                    index={index + 1}
                    key={index + 1}
                />
            })}
        </div>
    )
}

export default Polygon
