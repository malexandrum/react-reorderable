import { useCallback, useState } from 'react';
import './App.css';
import ReorderableItem from './components/ReorderableItem';
import CustomComponent from './CustomComponent'
import Settings from './Settings';
import { Settings as SettingsShape } from './context';
import { SettingsCtx } from './context';

function App() {
  const [items, setItems] = useState(Array(1000).fill(0).map((_, i) => i).map(x => ({ id: '1-' + x.toString(), height: 30 + 50 * Math.random() })))
  const [items2, setItems2] = useState(Array(5).fill(0).map((_, i) => i).map(x => ({ id: '2-' + x.toString(), height: 30 + 50 * Math.random() })))
  const [settings, setSettings] = useState<SettingsShape>({
    ghostOpacity: false,
    disableAnimation: false,
    dragFromAnywhere: true
  })
  const [history, setHistory] = useState<string[]>([]);

  const handleDrop = useCallback((targetType: string, sourceType: string, targetId: string, sourceId: string, isBefore: boolean | undefined) => {
    setHistory(h => [...h, `{ Type: ${sourceType}, Id: ${sourceId} } moved ${isBefore ? 'before' : 'after'} { Type: ${targetType}, Id: ${targetId} }`])

    if (sourceType === targetType) {
      const setSrcTgtItems = sourceType === '1' ? setItems : setItems2
      setSrcTgtItems(items => {
        const newItems = [...items]
        const targetIdx = items.findIndex(x => x.id === targetId)
        const sourceIdx = items.findIndex(x => x.id === sourceId)
        const source = items[sourceIdx]
        newItems.splice(isBefore ? targetIdx : targetIdx + 1, 0, source);
        const shouldShift = (targetIdx < sourceIdx) || ((targetIdx === sourceIdx) && isBefore)
        newItems.splice(sourceIdx + (shouldShift ? 1 : 0), 1);
        return newItems
      })      
    } else {
          const setSrcItms = sourceType === '1' ? setItems : setItems2
          const setTgtItems = targetType === '1' ? setItems : setItems2
          setSrcItms(srcItems => {
            const newSrcItems = [...srcItems]
            const sourceIdx = srcItems.findIndex(x => x.id === sourceId)
            const source = srcItems[sourceIdx]

            newSrcItems.splice(sourceIdx, 1);

            setTgtItems(items => { 
              const newTgtItems = [...items];
              const targetIdx = items.findIndex(x => x.id === targetId)
              newTgtItems.splice(isBefore ? targetIdx : targetIdx + 1, 0, source); 
              return newTgtItems; 
            })

            return newSrcItems
          })          
    }

  }, [])

  return (
    <div style={{ padding: 10 }}>
      <h1>React Reorderable Demo</h1>

      <SettingsCtx.Provider value={{ settings, setSettings }}>
        <Settings />
      </SettingsCtx.Provider>

      <div style={{ display: 'flex' }}>
        <div>
          Count: {items?.length || 0}
          {items.map((x, idx) =>
            <ReorderableItem id={x?.id} type='1' acceptedTypes={['1']} key={x?.id} idx={idx} handleClass={settings?.dragFromAnywhere ? undefined : 'handle'} disableAnimation={settings?.disableAnimation} ghostOpacity={settings?.ghostOpacity ? .2 : 0} onDrop={handleDrop}>
              <CustomComponent id={x?.id} type='1' height={x?.height} />
            </ReorderableItem>
          )}
        </div>

        <div>
          Count: {items2?.length || 0}
          {items2.map((x, idx) =>
            <ReorderableItem id={x?.id} type='2' acceptedTypes={['1', '2']} key={x?.id} idx={idx} handleClass={settings?.dragFromAnywhere ? undefined : 'handle'} disableAnimation={settings?.disableAnimation} ghostOpacity={settings?.ghostOpacity ? .2 : 0} onDrop={handleDrop}>
              <CustomComponent id={x?.id} type='2' height={x?.height} />
            </ReorderableItem>
          )}
        </div>

        <div style={{ marginLeft: 30, fontFamily: 'monospace' }}>
          <h2>Reorder Log</h2>
          {history.map((h, i) => <div key={i}>{h}</div>)}
        </div>

      </div>

    </div>
  );


}

export default App;
