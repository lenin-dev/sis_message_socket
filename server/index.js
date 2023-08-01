import express from 'express';
import morgan from 'morgan';
import http from 'http';
import cors from 'cors';
import { Server as SocketServer } from 'socket.io';
import { PORT } from './config.js';

const app = express();                          // Aplicacion de express
const server = http.createServer(app);          // la app de express se convierte en un servidor http
const io = new SocketServer(server, {
    cors: {
        origin: 'http://localhost:3000',
    },
});                  // El server se lo pasa como parametro al servidor de web socket

app.use(cors());
app.use(morgan("dev"));

io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('message', (message) => {
        console.log(message);
        socket.broadcast.emit('message', {
            body: message,
            from: socket.id
        });
    });
});

server.listen(PORT);
console.log('Servidro corriendo: localhost: ' + PORT);