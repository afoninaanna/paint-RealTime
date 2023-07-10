import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef } from 'react';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import '../styles/canvas.scss';
import Brush from '../tools/Brush';

const Canvas = observer (() => {
  const canvasRef = useRef();

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    toolState.setTool(new Brush(canvasRef.current));
  }, [])

  function mouseDownHandler() {
    canvasState.pushToUndo(canvasRef.current.toDataURL())
  }

  return (
    <div className='canvas'>
        <canvas onMouseDown={() => mouseDownHandler() } ref={canvasRef} width={600} height={600}/>
    </div>
  )
})

export default Canvas