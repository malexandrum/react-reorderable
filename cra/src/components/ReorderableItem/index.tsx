import React from 'react'
import { DragEvent, MouseEvent, useRef, useState } from 'react'
import './index.css'

let draggedElement: HTMLElement | undefined, draggedSize: number, draggedIdx: number

// (window as any).ComponentReact = React

type ReorderableItemProps = {
    acceptedTypes: string[],
    children: JSX.Element | JSX.Element[],
    disableAnimation?: boolean,
    ghostOpacity?: number,
    handleClass?: string,
    id: string,
    onDrop: (targetType: string, sourceType: string, targetId: string, sourceId: string, isBefore: boolean) => void,
    idx: number,
    type: string,
}
function ReorderableItem(
    {
        acceptedTypes,
        children,
        disableAnimation,
        ghostOpacity = .2,
        handleClass,
        id,
        onDrop,
        idx,
        type,
    }: ReorderableItemProps) {

    const [preventDrag, setPreventDrag] = useState<boolean>(!!handleClass)
    const [isActiveTargetBefore, setIsActiveTargetBefore] = useState<boolean>()
    const [isBeingDragged, setIsBeingDragged] = useState<boolean>()

    const dragCounter = useRef(0)
    let domElement = useRef<HTMLDivElement>(null)
    let isValidTarget = useRef<boolean>(false)

    const style: React.CSSProperties = {
        cursor: (!handleClass ? 'move' : undefined),
        display: ghostOpacity ? undefined : (isBeingDragged ? 'none' : undefined),
        opacity: ghostOpacity ? (isBeingDragged ? ghostOpacity : undefined) : undefined
    }

    return (<div
        draggable
        onMouseDown={handleMouseDown}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={"reorderable-item" + (disableAnimation ? " disable-animation" : "")}
        style={style}
        ref={domElement}
    >
        <div style={{ height: isActiveTargetBefore === true ? draggedSize : 0 }}>&nbsp;</div>
        {children}
        <div style={{ height: isActiveTargetBefore === false ? draggedSize : 0 }}>&nbsp;</div>
    </div>)

    function handleDragEnter(event: DragEvent) {
        if (dragCounter.current++ > 0) { // this fires multiple times when dragging over children, but we only need to eval once
            return;
        }

        if (draggedElement !== domElement.current && acceptedTypes?.indexOf(event.dataTransfer.types[0]) !== -1) {
            const target = event.currentTarget ?? event.target
            const rect = target.getBoundingClientRect()
            isValidTarget.current = true;

            if (event.clientY >= rect.y + rect.height / 2) {
                if (ghostOpacity && draggedIdx - 1 === idx) {
                    return; // this means moving item in same position. We could ignore this change in the handler, but it would make no sense to allow it for UX reasons
                }
                setIsActiveTargetBefore(false)
            } else {
                if (ghostOpacity && draggedIdx + 1 === idx) {
                    return;
                }
                setIsActiveTargetBefore(true)
            }
        } else {
            isValidTarget.current = false
            isActiveTargetBefore && setIsActiveTargetBefore(undefined)
        }
    }

    function handleDragLeave() {
        if (dragCounter.current-- === 1) {
            setIsActiveTargetBefore(undefined)
            isValidTarget.current = false
        }
    }

    function handleMouseDown(event: MouseEvent<HTMLElement>) {
        if (!!handleClass) {
            if ((event.target as Element)?.classList.contains(handleClass)) {
                setPreventDrag(false)
            } else if (!preventDrag) {
                setPreventDrag(true)
            }
        }
    }

    function handleDragStart(event: DragEvent) {
        if (preventDrag) {
            event.preventDefault()
        } else {
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.setData(type, id)
            draggedElement = (event.currentTarget ?? event.target) as HTMLElement
            draggedSize = draggedElement.offsetHeight
            draggedIdx = idx
            setTimeout(() => { // without the async change drag doesn't work
                setIsBeingDragged(true)
            }, 0)
        }
    }

    function handleDragEnd() {
        setIsBeingDragged(false)
        draggedElement = undefined
    }

    function handleDragOver(event: React.DragEvent) {
        if (isValidTarget.current) { // using this to increase performance when dragging over invalid targets. We only need to check if target is valid on dragEnter
            event.preventDefault()

            const target = event.currentTarget ?? event.target
            const rect = target.getBoundingClientRect()

            const adjustment = isActiveTargetBefore !== undefined ? draggedSize : 0

            if (event.clientY >= (rect.y + adjustment + (rect.height - adjustment) / 2)) {
                if (ghostOpacity && draggedIdx - 1 === idx) {
                    return; // this means moving item in same position. We could ignore this change in the handler, but it would make no sense to allow it for UX reasons
                }
                setIsActiveTargetBefore(false)
            }
            else if (event.clientY <= (rect.y + (rect.height - adjustment) / 2)) {
                if (ghostOpacity && draggedIdx + 1 === idx) {
                    return;
                }
                setIsActiveTargetBefore(true)
            }
        }
    }

    function handleDrop(event: React.DragEvent) {
        dragCounter.current = 0
        if (isActiveTargetBefore !== undefined) {
            setIsActiveTargetBefore(undefined)
            const incomingType = event.dataTransfer.types[0]
            const incomingId = event.dataTransfer.getData(event.dataTransfer.types[0])
            isValidTarget.current = false
            onDrop?.(type, incomingType, id, incomingId, isActiveTargetBefore)
        }
    }
}


export default ReorderableItem