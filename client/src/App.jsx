/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  console.log(allMessages);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form submitted");
    socket.emit("message", { message, room });
    setMessage("");
  };
  const joinRoomHandler = (e) => {
    e.preventDefault();
    // console.log("Form submitted");
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected to server", socket.id);
    });

    socket.on("received-message", (data) => {
      console.log(data);
      setAllMessages((prev) => [...prev, data]);
    });

    socket.on("welcome", (message) => {
      console.log(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ height: 400 }} />
      <Typography variant="h3" component="div" gutterBottom>
        {socketID}
      </Typography>
      <form onSubmit={joinRoomHandler}>
        <h5>JOIN ROOM</h5>
        <TextField
          val={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>
      <form onSubmit={handleSubmit}>
        <TextField
          val={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
        <TextField
          val={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
      <Stack>
        {allMessages.map((msg, index) => (
          <Typography key={index} variant="body1" component="div">
            {msg}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
