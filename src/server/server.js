const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors'); // Import the 'cors' library

const app = express();
app.use(cors()); // Use the 'cors' middleware to enable CORS

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3002', // Replace with the origin of your React app
        methods: ['GET', 'POST'],
    },
});

let buttonColor = 'red';
let currentSelectSeat = [];

io.on('connection', socket => {
    console.log('New client connected: ' + socket.id);

    socket.emit('getId', socket.id);

    // Gửi màu sắc hiện tại của nút A cho người dùng mới kết nối
    // socket.emit('update-button', buttonColor);

    // socket.on('button-clicked', color => {
    //     buttonColor = color;
    //     io.emit('update-button', color);
    // });

    // socket.emit('current-select-seat-server', currentSelectSeat);

    socket.on('current-select-seat-client', data => {
        currentSelectSeat = data;
        console.log(currentSelectSeat);
        io.emit('current-select-seat-server', currentSelectSeat);
    });

    socket.on('disconnect', () => {
        console.log(`Client ${socket.id} disconnected`);
    });
});

server.listen(5000, () => {
    console.log('WebSocket server is running on port 5000');
});
