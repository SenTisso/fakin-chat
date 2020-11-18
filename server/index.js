const express = require('express');
const socketio = require('socket.io')
const http = require('http');
const router = require('./router');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')

const PORT = process.env.PORT || 5000;


const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {

    socket.on('join', ({ name, room }, callback) => {
        console.log(`user "${name}" has joined to room "${room}"`);
        const { error, user } = addUser({ id: socket.id, name, room })

        if (error) return callback(error);

        socket.emit('message', {user: 'admin', text: `${user.name}, welcome to the room ${user.room}`}) // posli zpravu tomu, kdo se pripojil
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name} has joined`}) // posli vsem zpravu vsem do roomky, krome toho, kdo se pripojil

        socket.join(user.room)

        callback();
    })

    // poslouchej, pokud uzivatel posle event 'sendMessage'
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        console.log(`${user.name}: "${message}", to room: ${user.room}`);

        io.to(user.room).emit('message', { user: user.name, text: message});
    })

    socket.on("disconnect", () => {
        console.log('user disconnect');
    })
})

app.use(router);
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
