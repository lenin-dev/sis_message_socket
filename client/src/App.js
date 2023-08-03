import './App.css';
import io from 'socket.io-client';
import { useState, useEffect } from 'react';

const socket = io('http://localhost:4000');

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
      <section className="container">
        <div className='container-messages'>
          {
            messages.map((message, index) => (
              <div key={index}>
                <p>{message.from}: {message.body}</p>
              </div>
            ))
          }
        </div>

        <form onSubmit={handlesumit}>
          <input placeholder="Mensaje" onChange={e => setMessage(e.target.value)} value={message}></input>
          <button type='submit'>Enviar</button>
        </form>
      </section>
      <aside className='users'>
        {
          messages.map((message, index) => (
            <p key={index}>{message.from}</p>
          ))
        }
      </aside>
    </div>
  );
}

export default App;