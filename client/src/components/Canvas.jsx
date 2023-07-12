import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import '../styles/canvas.scss';
import Brush from '../tools/Brush';
import { Modal, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Rect from '../tools/Rect';
import axios from 'axios';

const Canvas = observer (() => {
  const canvasRef = useRef();
  const usernameRef = useRef();
  const [modal, setModal] = useState(true);
  const params = useParams();

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    let ctx = canvasRef.current.getContext('2d');
    axios.get(`http://localhost:5000/image?id=${params.id}`)
      .then(responce => {
        const img = new Image();
        img.src = responce.data;
        img.onload = () => {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      })
  }, [])

  useEffect(() => {
    if(canvasState.username) {
      const socket = new WebSocket(`ws://localhost:5000/`);
      canvasState.setSocket(socket); 
      canvasState.setSessionid(params.id);
      toolState.setTool(new Brush(canvasRef.current, socket, params.id)); 
      socket.onopen = () => {
        console.log('подключение установлено');
        socket.send(JSON.stringify({
          id: params.id,
          username: canvasState.username,
          method: "connection"
        }))
      }
      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        switch (msg.method) {
          case 'connection':
            console.log(`пользователь ${msg.username} присоединился`);
            break;
          case 'draw':
            drawHandler(msg);
            break;
          default:
            break;
        }
      }
    }
  }, [canvasState.username])

  function drawHandler(msg) {
    const figure = msg.figure;
    const ctx = canvasRef.current.getContext('2d');
    switch (figure.type) {
      case 'brush':
        Brush.draw(ctx, figure.x, figure.y);
        break;
      case 'rect':
        Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color);
        break;
      case 'finish':
        ctx.beginPath();
        break;
    
      default:
        break;
    }
  }

  function mouseDownHandler() {
    canvasState.pushToUndo(canvasRef.current.toDataURL());
    axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
      .then(responce => console.log(responce.data)); 
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