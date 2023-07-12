import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import '../styles/canvas.scss';
import Brush from '../tools/Brush';
import { Modal, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const Canvas = observer (() => {
  const canvasRef = useRef();
  const usernameRef = useRef();
  const [modal, setModal] = useState(true);
  const params = useParams();

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    toolState.setTool(new Brush(canvasRef.current));
  }, [])

  useEffect(() => {
    if(canvasState.username) {
      const socket = new WebSocket(`ws://localhost:5000/`);
      socket.onopen = () => {
        console.log('подключение установлено');
        socket.send(JSON.stringify({
          id: params.id,
          username: canvasState.username,
          method: "connection"
        }))
      }
      socket.onmessage = (event) => {
        console.log(event.data);
      }
    }
  }, [canvasState.username])

  function mouseDownHandler() {
    canvasState.pushToUndo(canvasRef.current.toDataURL())
  }

  function connectionHandler() {
    canvasState.setUsername(usernameRef.current.value); 
    setModal(false);
  }

  return (
    <div className='canvas'>
      <Modal show={modal} onHide={() => {}}>
        <Modal.Header>
          <Modal.Title>Введите ваше имя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input ref={usernameRef} type='text'/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => connectionHandler()}>
            Войти
          </Button>
        </Modal.Footer>
      </Modal>
      <canvas onMouseDown={() => mouseDownHandler() } ref={canvasRef} width={600} height={600}/>
    </div>
  )
})

export default Canvas