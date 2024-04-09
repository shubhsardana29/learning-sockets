import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { Socket } from "dgram";

const app = express();
const port = 3000;

// Create an HTTP server using Express app
const server = createServer(app);

// Configure Socket.IO server with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Set up basic CORS for Express app (not needed anymore)
// app.use(cors({
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST'],
//     credentials: true,
// }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log("a user connected",socket.id);
  
    socket.on("message", (data) => {
        console.log(data);
        socket.to(data.room).emit("received-message", data.message);
    })

    socket.on("join-room", (room) => {
        console.log("joining room", room);
        socket.join(room);
        console.log(`user joined ${room}`);
    });
    
    socket.on("disconnect", () => {
        console.log("user disconnected" , socket.id);
    });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
