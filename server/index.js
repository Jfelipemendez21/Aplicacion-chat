import http from "http"
import express from "express"
import morgan from "morgan"
// Socket.IO permite la comunicación en tiempo real entre el servidor y el cliente
import {Server as Socketserver} from "socket.io"
import cors from "cors"
import mongoose from "mongoose"
import { port } from "../config.js"
import bodyParser from "body-parser"
import router from "./routes/messages.js"


// Mongoose 
const url= "mongodb+srv://jfelipemendez:pipe7410487@cluster0.qsbgqaq.mongodb.net/messages?retryWrites=true&w=majority"; 

//Configuración para evitar fallos en la conexión con mongoDB
mongoose.Promise= global.Promise

const app= express(); 


// Servidor con el modulo http

const server= http.createServer(app);
// la propiedad cors del objeto indica que se pueden conectar desde cualquier direccion 
const io= new Socketserver(server, {
    cors:{
        origin: "*"
    }
}); 

// Middlewares
app.use(cors()); 
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

io.on('connection', (socket)=>{
    console.log(socket.id);
    console.log("Cliente conectado");
    
    // accion del evento message 
    socket.on("message", ((message, nickname)=>{
        // para enviar mensajes a todos los clientes conectados a un servidor de socket, excepto al cliente que envió el mensaje original.
        socket.broadcast.emit("message", {
            body: message,
            from: nickname
        })
    }))
})

app.use("/api", router)

// conexion a la db y puerto
mongoose.connect(url, {useNewUrlParser: true}).then(()=>{
    console.log("Conexion a la base de datos realizada con exito");
    server.listen(port, ()=>{
        console.log("Servidor ejecutandose en https://servidor-aplicacion-chat.vercel.app:", port);
    })
})






