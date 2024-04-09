import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;

const secretKeyJWT = "randomsecretkey";

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
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/login", (req, res) => {
  const token = jwt.sign({ _id: "random123" }, secretKeyJWT);
  res
    .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
    .json({
      message: "Logged in",
    });
});


io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, (err) => {
    if (err) return next(err);
    const token = socket.request.cookies.token;
      if (!token) return next(new Error("Authentication error"))
      const decoded = jwt.verify(token, secretKeyJWT);
      next();
  });
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("message", (data) => {
    console.log(data);
    socket.to(data.room).emit("received-message", data.message);
  });

  socket.on("join-room", (room) => {
    console.log("joining room", room);
    socket.join(room);
    console.log(`user joined ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
