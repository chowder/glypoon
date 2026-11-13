import GameState from "../classes/GameState"
import {useEffect, useRef, useState} from 'react'
import {useStoreState} from "easy-peasy"
import {
    useFloating,
    useHover,
    useClick,
    useDismiss,
    useInteractions,
    shift,
    offset,
    flip,
    autoUpdate,
    useTransitionStyles
} from '@floating-ui/react';

const NO_DEFINITION = "Could not find definition!"

const Answer = ({text, isVisible, isPangram}) => {
    const gameState = useStoreState(store => store.gameState)
    const definitions = useStoreState(store => store.solution.definitions)

    const [definition, setDefinition] = useState(null)
    const [isTooltipOpen, setTooltipOpen] = useState(false);
    const [isNewlyFound, setNewlyFound] = useState(false)
    const wasVisible = useRef(isVisible)

    useEffect(() => {
        if (isVisible && !wasVisible.current) {
            setNewlyFound(true)
        }
        wasVisible.current = isVisible
    }, [isVisible])

    const canShowDefinition = isVisible || gameState === GameState.ENDED

    const {refs, floatingStyles, context} = useFloating({
        open: isTooltipOpen,
        onOpenChange: (open) => setTooltipOpen(open && canShowDefinition),
        placement: "top",
        middleware: [offset(10), flip(), shift({padding: 5})],
        whileElementsMounted: autoUpdate,
    })

    const hover = useHover(context, {mouseOnly: true});
    const click = useClick(context, {ignoreMouse: true});
    const dismiss = useDismiss(context);

    const {getReferenceProps, getFloatingProps} = useInteractions([
        hover,
        click,
        dismiss,
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
            try {
                const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${text}`)
                const data = await res.json()
                const entry = data.find(element => element.meanings.length > 0);
                setDefinition(entry.meanings[0].definitions[0].definition)
            } catch (e) {
                setDefinition(NO_DEFINITION)
            }
        }
        if (canShowDefinition && definition === null) {
            if (definitions && text in definitions) {
                // Use the definition embedded in the puzzle
                setDefinition(definitions[text] || NO_DEFINITION)
            } else {
                // Older puzzles don't embed definitions, so fall back to the API
                fetchDefinition()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, isVisible, gameState, definition, definitions])

    const getColor = () => {
        // TODO: Turn these into CSS components
        if (isVisible && isPangram) {
            return "bg-gradient-to-r from-yellow-400 to-yellow-200 dark:from-yellow-600 dark:to-yellow-500"
        }
        if (isVisible) {
            return "bg-blue-200 dark:bg-blue-500"
        }
        if (gameState === GameState.ENDED) {
            return "bg-red-200 dark:bg-red-800"
        }

        return "bg-gray-200 dark:bg-gray-600"
    }

    let color = getColor()

    return (
        <>
            {isTooltipOpen &&
                <div
                    className="z-20"
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
                className={`answer-bg ${color} ${isNewlyFound ? "motion-safe:animate-found" : ""}`}
                onAnimationEnd={() => setNewlyFound(false)}
                ref={refs.setReference}
                {...getReferenceProps()}>
                <p className='answer-text'>{canShowDefinition ? text : ""}</p>
            </div>
        </>
    )
}

export default Answer
