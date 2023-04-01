var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import './index.css';
var draggedElement, draggedSize, draggedIdx;
function ReorderableItem(_a) {
    var acceptedTypes = _a.acceptedTypes, children = _a.children, disableAnimation = _a.disableAnimation, _b = _a.ghostOpacity, ghostOpacity = _b === void 0 ? .2 : _b, handleClass = _a.handleClass, id = _a.id, onDrop = _a.onDrop, idx = _a.idx, type = _a.type;
    var _c = useState(!!handleClass), preventDrag = _c[0], setPreventDrag = _c[1];
    var _d = useState(), isActiveTargetBefore = _d[0], setIsActiveTargetBefore = _d[1];
    var _e = useState(), isBeingDragged = _e[0], setIsBeingDragged = _e[1];
    var dragCounter = useRef(0);
    var domElement = useRef(null);
    var isValidTarget = useRef(false);
    var style = {
        cursor: (!handleClass ? 'move' : undefined),
        display: ghostOpacity ? undefined : (isBeingDragged ? 'none' : undefined),
        opacity: ghostOpacity ? (isBeingDragged ? ghostOpacity : undefined) : undefined
    };
    return (_jsxs("div", __assign({ draggable: true, onMouseDown: handleMouseDown, onDragStart: handleDragStart, onDragEnd: handleDragEnd, onDragOver: handleDragOver, onDragEnter: handleDragEnter, onDragLeave: handleDragLeave, onDrop: handleDrop, className: "reorderable-item" + (disableAnimation ? " disable-animation" : ""), style: style, ref: domElement }, { children: [_jsx("div", __assign({ style: { height: isActiveTargetBefore === true ? draggedSize : 0 } }, { children: "\u00A0" })), children, _jsx("div", __assign({ style: { height: isActiveTargetBefore === false ? draggedSize : 0 } }, { children: "\u00A0" }))] })));
    function handleDragEnter(event) {
        var _a;
        if (dragCounter.current++ > 0) { // this fires multiple times when dragging over children, but we only need to eval once
            return;
        }
        if (draggedElement !== domElement.current && (acceptedTypes === null || acceptedTypes === void 0 ? void 0 : acceptedTypes.indexOf(event.dataTransfer.types[0])) !== -1) {
            var target = (_a = event.currentTarget) !== null && _a !== void 0 ? _a : event.target;
            var rect = target.getBoundingClientRect();
            isValidTarget.current = true;
            if (event.clientY >= rect.y + rect.height / 2) {
                if (ghostOpacity && draggedIdx - 1 === idx) {
                    return; // this means moving item in same position. We could ignore this change in the handler, but it would make no sense to allow it for UX reasons
                }
                setIsActiveTargetBefore(false);
            }
            else {
                if (ghostOpacity && draggedIdx + 1 === idx) {
                    return;
                }
                setIsActiveTargetBefore(true);
            }
        }
        else {
            isValidTarget.current = false;
            isActiveTargetBefore && setIsActiveTargetBefore(undefined);
        }
    }
    function handleDragLeave() {
        if (dragCounter.current-- === 1) {
            setIsActiveTargetBefore(undefined);
            isValidTarget.current = false;
        }
    }
    function handleMouseDown(event) {
        var _a;
        if (!!handleClass) {
            if ((_a = event.target) === null || _a === void 0 ? void 0 : _a.classList.contains(handleClass)) {
                setPreventDrag(false);
            }
            else if (!preventDrag) {
                setPreventDrag(true);
            }
        }
    }
    function handleDragStart(event) {
        var _a;
        if (preventDrag) {
            event.preventDefault();
        }
        else {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData(type, id);
            draggedElement = ((_a = event.currentTarget) !== null && _a !== void 0 ? _a : event.target);
            draggedSize = draggedElement.offsetHeight;
            draggedIdx = idx;
            setTimeout(function () {
                setIsBeingDragged(true);
            }, 0);
        }
    }
    function handleDragEnd() {
        setIsBeingDragged(false);
        draggedElement = undefined;
    }
    function handleDragOver(event) {
        var _a;
        if (isValidTarget.current) { // using this to increase performance when dragging over invalid targets. We only need to check if target is valid on dragEnter
            event.preventDefault();
            var target = (_a = event.currentTarget) !== null && _a !== void 0 ? _a : event.target;
            var rect = target.getBoundingClientRect();
            var adjustment = isActiveTargetBefore !== undefined ? draggedSize : 0;
            if (event.clientY >= (rect.y + adjustment + (rect.height - adjustment) / 2)) {
                if (ghostOpacity && draggedIdx - 1 === idx) {
                    return; // this means moving item in same position. We could ignore this change in the handler, but it would make no sense to allow it for UX reasons
                }
                setIsActiveTargetBefore(false);
            }
            else if (event.clientY <= (rect.y + (rect.height - adjustment) / 2)) {
                if (ghostOpacity && draggedIdx + 1 === idx) {
                    return;
                }
                setIsActiveTargetBefore(true);
            }
        }
    }
    function handleDrop(event) {
        dragCounter.current = 0;
        if (isActiveTargetBefore !== undefined) {
            setIsActiveTargetBefore(undefined);
            var incomingType = event.dataTransfer.types[0];
            var incomingId = event.dataTransfer.getData(event.dataTransfer.types[0]);
            isValidTarget.current = false;
            onDrop === null || onDrop === void 0 ? void 0 : onDrop(type, incomingType, id, incomingId, isActiveTargetBefore);
        }
    }
}
export default ReorderableItem;
