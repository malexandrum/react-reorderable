# react-reorderable #
Wrap your custom components to add drag to reorder capabilities

Demo: https://malexandrum.github.io/react-reorderable/

## Props
- `acceptedTypes: string[]` - list of types that this item accepts to be dragged over
- `disableAnimation?: boolean`
- `ghostOpacity?: number` - opacity for preview of item being dragged
- `handleClass?: string` - class of element in your custom component that will be used as a drag handle. If not specified, your component will be draggable from any point
- `onDrop: (targetType: string, sourceType: string, targetId: string, sourceId: string, isBefore: boolean) => void` - your handler will be called when element has been successfully dropped on a target that accepts source 