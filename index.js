const express = require('express');
const router = require('./router');
const { resolve } = require('path');

const app = express();
const PORT = process.env.PORT || 3000;



app.get('*.*', express.static(resolve(__dirname, 'static')));
app.set('view engine', 'ejs');
app.set('views', resolve(__dirname, 'views'));
app.use(router);

const server = app.listen(PORT, () => {
    console.log('server started');
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log(socket.id);
    // socket.on('call', (data) => {
    //     socket.broadcast.emit('offer', data);
    // });
    // socket.on('pickup', (data) => {
    //     socket.broadcast.emit('answer', data);
    // })
    socket.on('message', (data) => {
        socket.broadcast.emit('message', data);
    })
});



io.on('disconnect', (socket) => {
    console.log(socket.id);
});