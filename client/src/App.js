import './App.css';
import io from "socket.io-client"
import axios from "axios"
import { useState, useEffect } from 'react';

// Conexion para escuchar y enviar los eventos 

const socket= io('http://localhost:3000');

function App() {  
  
  
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState(""); 
  const [disabled, setDisabled] = useState(false);
  const [messages, setMessages] = useState([]); 
  
  const [storeMessages, setStoreMessages] = useState([])
  const [firstTime, setFirstTime] = useState(false); 
  
  const url="http://localhost:3000/api/";

  useEffect(() => {
    const mensajeRecibido= (mensaje)=>{
      setMessages([mensaje, ...messages]);
    }
    socket.on("message", mensajeRecibido);

    return()=>{
      socket.off("message", mensajeRecibido);
    }

  }, [messages])

  // Este if verfica si es 
  if(firstTime){
    axios.get(url + "messages").then(res =>{
      setStoreMessages(res.data.messages);
    })
    setFirstTime(true);
  }
  

  const handlerSubmit=(e)=>{
    e.preventDefault(); 

    if(nickname !== ""){
      socket.emit("message", message, nickname); 

      const newMessage={
        body: message,
        from: "Yo"
      }
      setMessages([newMessage, ...messages])
      setMessage("")


      // Peticion http por post para guardar el mensaje en la bd
      axios.post(url + "save", {
        body: message,
        from: nickname
      })
      

    }else{
      alert("Para enviar un mensaje debes establecer el nickname")
    }
  }

  const nickNameSubmit=(e)=>{
    e.preventDefault(); 
    setNickname(nickname);
    setDisabled(true);
  }


  return (
    <div className="App">
      <div className='container mt-3'>
        <div className='card'>
          <div className='card-body'>
            <h5 className='text-center'>Chat</h5>

            {/* Nickaname */}
            <form onSubmit={nickNameSubmit}>
              <div className='d-flex mb-3'>
                <input type="text" className='form-control' placeholder='Nickname...' id='nickname' onChange={(e)=>{setNickname(e.target.value)}} disabled={disabled}></input>
                <button className='btn btn-success mx-3' type='submit' id='btn-nickname' disabled={disabled}>Establecer</button>
              </div>
            </form>


            {/* Chat */}
            <form onSubmit={handlerSubmit}>
              <div className='d-flex'>
                <input type="text" className='form-control' placeholder='Mensaje...' id='mensaje' onChange={(e)=>{setMessage(e.target.value)}} value={message}></input>
                <button className='btn btn-success mx-3' type='submit' id='btn-mensaje'>Enviar</button>
              </div>
            </form>

            
          </div>
        </div>

            {/* Chat message */}
        <div className='card mt-3 mb-3' id="content-chat">
            <div className='card-body'>

              {messages.map((message, index) => (
                <div key={index} className={`d-flex p-3 ${message.from==="Yo" ? "justify-content-end" : "justify-content-start"}`}>
                  <div className={`card mb-3 border-1 ${message.from==="Yo" ? "bg-primary bg-opacity-25" : "bg-light"}`}>
                    <div className='card-body'>
                      <small className=''>{message.from}: {message.body}</small>
                    </div>
                  </div>
                </div>
              ))}

               {/* Chat stored messages */}

           <small className='text-center text-muted'>...Mensajes guardados...</small>
                {storeMessages.map((message, index) => (
                  <div key={index} className={`d-flex p-3 ${message.from===nickname ? "justify-content-end" : "justify-content-start"}`}>
                    <div className={`card mb-3 border-1 ${message.from===nickname ? "bg-success bg-opacity-25" : "bg-light"}`}>
                      <div className='card-body'>
                        <small className='text-muted'>{message.from}: {message.message}</small>
                      </div>
                    </div>
                  </div>
                ))}

            </div>
        </div>
      </div>
    </div>
  );
}

export default App;
