// import React from 'react';

import { useState } from 'react';
import './App.css';
import ReorderableItem from './components/ReorderableItem';
import handleImg from './drag-handle.svg';

function App() {
  const [items, setItems] = useState(Array(4).fill(0).map((_, i) => i).map(x => ({ id: x.toString(), height: 15 + 0 * Math.random() })))
  const [items2, setItems2] = useState(Array(10).fill(0).map((_, i) => i).map(x => ({ id: x.toString(), height: 15 + 0 * Math.random() })))
  const [ghostOpacity, setGhostOpacity] = useState(true)
  const [disableAnimation, setDisableAnimation] = useState(false)

  return (
    <div style={{ padding: 10 }}>
      <label>
        <input type='checkbox' checked={ghostOpacity} onChange={() => setGhostOpacity(!ghostOpacity)} />
        ghostOpacity
      </label>
      <br />
      <label>
        <input type='checkbox' checked={disableAnimation} onChange={() => setDisableAnimation(!disableAnimation)} />
        disableAnimation
      </label>
      <div style={{ display: 'flex' }}>
        <div>
          {items.map((x, idx) =>
            <ReorderableItem id={x.id} type='type1' acceptedTypes={['type1']} key={x.id} idx={idx} handleClass='handle' disableAnimation={disableAnimation} ghostOpacity={ghostOpacity ? .2 : 0} onDrop={handleDrop}>
              <div className='item' style={{ height: x.height }}>
                {/* <div className='handle' style={{ padding: 10 }}>=</div> */}
                <img src={handleImg} width={15} draggable={false} alt='handle' className='handle' />
                <div>Type: 1, Id: {x.id}</div>
                &nbsp;<button>Edit</button>
              </div>
            </ReorderableItem>
          )}
        </div>

        <div>
          {items2.map((x, idx) =>
            <ReorderableItem id={x.id} type='type2' acceptedTypes={['type1','type2']} key={x.id} idx={idx} handleClass='handle' disableAnimation={disableAnimation} ghostOpacity={ghostOpacity ? .2 : 0} onDrop={handleDrop}>
              <div className='item' style={{ height: x.height }}>
                {/* <div className='handle' style={{ padding: 10 }}>=</div> */}
                <img src={handleImg} width={15} draggable={false} alt='handle' className='handle' style={{cursor: 'move'}} />
                <div>Type: 2, Id: {x.id}</div>
                &nbsp;<button>Edit</button>
              </div>
            </ReorderableItem>
          )}
        </div>

      </div>

    </div>
  );

  function handleDrop(targetType: string, sourceType: string, targetId: string, sourceId: string, isBefore: boolean | undefined) {
    console.log('App level drop', arguments)

    const itms = sourceType === 'type1' ? items : items2
    const setItms = sourceType === 'type1' ? setItems : setItems2

    const targetIdx = itms.findIndex(x => x.id === targetId)
    const target = itms[targetIdx]
    const sourceIdx = itms.findIndex(x => x.id === sourceId)
    const source = itms[sourceIdx]

    if (targetIdx < sourceIdx) {
      if (isBefore) {
        setItms([...itms.slice(0, targetIdx), source, target, ...itms.slice(targetIdx + 1, sourceIdx), ...itms.slice(sourceIdx + 1)]) // check boundary
      } else {
        setItms([...itms.slice(0, targetIdx), target, source, ...itms.slice(targetIdx + 1, sourceIdx), ...itms.slice(sourceIdx + 1)]) // check boundary
      }
    } else {
      if (isBefore) {
        setItms([...itms.slice(0, sourceIdx), ...itms.slice(sourceIdx + 1, targetIdx), source, target, ...itms.slice(targetIdx + 1)]) // check boundary
      } else {
        setItms([...itms.slice(0, sourceIdx), ...itms.slice(sourceIdx + 1, targetIdx), target, source, ...itms.slice(targetIdx + 1)]) // check boundary
      }
    }

  }
}

export default App;
