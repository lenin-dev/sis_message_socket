import './App.css';
import io from 'socket.io-client';
import { useState, useEffect } from 'react';

const socket = io('http://localhost:4000');
console.log(socket);

function App() {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([])

  const handlesumit = (e) => {
    e.preventDefault();
    socket.emit('message', message);
    if(message !== "" && message.trim()) {
      const newMessages = {
        body: message.trim(),
        from: "me"
      }
      setMessages([...messages, newMessages])
      setMessage('');
    } else {
      console.log('debe de llenar el campo')
    }
  }

  useEffect(() => {
    const reciveMessage = message => {
      setMessages([...messages, message])
    }
    socket.on('message', reciveMessage);

    return () => {
      socket.off('message', reciveMessage);
    }
  }, [messages])
  
  return (
    <div className="App">
      <form onSubmit={handlesumit}>
        <input placeholder="Mensaje" onChange={e => setMessage(e.target.value)} value={message}></input>
        <button type='submit'>Enviar</button>
      </form>

      {
        messages.map((message, index) => (
          <div className='container-messages' key={index}>
            <p>{message.from}: {message.body}</p>
          </div>
        ))
      }

    </div>
  );
}

export default App;