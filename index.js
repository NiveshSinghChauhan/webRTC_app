const app = require('express')();
const io = require('socket.io')(app);

const PORT = 3000;


(async () => {

    try {
        await app.connect(PORT);
    } catch (error) {
        console.log(error);
    }
})()