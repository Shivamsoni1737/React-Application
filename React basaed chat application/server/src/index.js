const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const { addUser, removeUser, getUser, getUserInRoom} = require("./users");
const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connect' , (socket) => {
    socket.on('join', ({ name, room}, callback) => {
        const {error, user} = addUser({ id: socket.id, name, room});

        if(error) return callback(error);
        socket.join(user.room);
        socket.emit('message', {user: 'admin', text: `${user.name}, Welcome to the room: ${user.room}`});
        socket.broadcast.to(user.room).emit('message', { user:'admin', text: `${user.name} hs joined the ChatRoom!`});
        io.to(user.room).emit('roomdData', {room: user.room, users: getUserInRoom(user.room)});
        callback();
    });

    socket.on('disconnect', ()=> {
        const user= removeUser(socket.id);
        if(user) 
        {
            io.to(user.roomemit('message',{user: 'admin', text: `${user.name} has left the chatroom!`}));
            io.to(user.room)
        }
    })
})