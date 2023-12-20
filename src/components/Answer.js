import GameState from "../classes/GameState"
import {useEffect, useState} from 'react'
import {useStoreState} from "easy-peasy"
import {
    useFloating,
    useHover,
    useInteractions,
    shift,
    offset,
    flip,
    autoUpdate,
    useTransitionStyles
} from '@floating-ui/react';

const Answer = ({text, isVisible, isPangram}) => {
    const gameState = useStoreState(store => store.gameState)

    const [definition, setDefinition] = useState(null)
    const [isTooltipOpen, setTooltipOpen] = useState(false);

    const {refs, floatingStyles, context} = useFloating({
        open: isTooltipOpen,
        onOpenChance: setTooltipOpen,
        placement: "top",
        middleware: [offset(10), flip(), shift({padding: 5})],
        whileElementsMounted: autoUpdate,
    })

    const hover = useHover(context);

    const {getReferenceProps, getFloatingProps} = useInteractions([
        hover,
    ]);

    const tooltipTransition = useTransitionStyles(context, {
        initial: {
            opacity: 0,
            transform: "translateX(0) translateY(5px)",
        },
    });

    // Reset the definition every time the text changes
    useEffect(() => {
        setDefinition(null)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text])

    useEffect(() => {
        const fetchDefinition = async () => {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${text}`)
            const data = await res.json()
            try {
                const entry = data.find(element => element.meanings.length > 0);
                setDefinition(entry.meanings[0].definitions[0].definition)
            } catch (e) {
                setDefinition("Could not find definition!")
            }
        }
        if ((isVisible || gameState === GameState.ENDED) && definition === null) {
            fetchDefinition()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, isVisible, gameState, definition])

    function handleMouseEnter() {
        if (isVisible || gameState === GameState.ENDED) {
            setTooltipOpen(true)
        }
    }

    function handleMouseLeave() {
        setTooltipOpen(false)
    }

    const getColor = () => {
        // TODO: Turn these into CSS components
        if (isVisible && isPangram) {
            return "bg-gradient-to-r from-yellow-400 to-yellow-200 dark:from-yellow-600 dark:to-yellow-500"
        }
        if (isVisible) {
            return "bg-blue-200 dark:bg-blue-500"
        }
        if (gameState === GameState.ENDED) {
            return "bg-red-200 dark:bg-indigo-400"
        }

        return "bg-gray-200 dark:bg-gray-600"
    }

    let color = getColor()

    return (
        <>
            {isTooltipOpen &&
                <div
                    style={floatingStyles}
                    ref={refs.setFloating}
                    {...getFloatingProps()}
                >
                    <div style={tooltipTransition.styles} className="answer-definition">
                        {definition}
                    </div>
                </div>
            }
            <div
                className={`answer-bg ${color}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                ref={refs.setReference}
                {...getReferenceProps()}>
                <p className='answer-text'>{isVisible || gameState === GameState.ENDED ? text : ""}</p>
            </div>
        </>
    )
}

export default Answer
