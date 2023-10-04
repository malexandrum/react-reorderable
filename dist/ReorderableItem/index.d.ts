/// <reference types="react" />
import './index.css';
type ReorderableItemProps = {
    acceptedTypes: string[];
    children: JSX.Element | JSX.Element[];
    disableAnimation?: boolean;
    ghostOpacity?: number;
    handleClass?: string;
    id: string;
    onDrop: (targetType: string, sourceType: string, targetId: string, sourceId: string, isBefore: boolean) => void;
    idx: number;
    type: string;
};
declare function ReorderableItem({ acceptedTypes, children, disableAnimation, ghostOpacity, handleClass, id, onDrop, idx, type, }: ReorderableItemProps): JSX.Element;
export default ReorderableItem;
