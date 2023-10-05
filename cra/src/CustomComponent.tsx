import React from 'react'
import handleImg from './drag-handle.svg';
// import React from 'react'


interface CustomComponentProps {
    id: string;
    height: number;
    type: string;
}

function CustomComponent(props: CustomComponentProps) {
    const { id, height, type } = props;
    return <div className='item' style={{ minHeight: height }}>
        {/* <div className='handle' style={{ padding: 10 }}>=</div> */}
        <img src={handleImg} width={15} draggable={false} alt='handle' className='handle' style={{cursor: 'move'}} />
        <div>
            Any Custom Component
            <br />
            Type: {type}, Id: {id}</div>
        {/* &nbsp;<button>Edit</button> */}
    </div>
}

export default React.memo(CustomComponent)