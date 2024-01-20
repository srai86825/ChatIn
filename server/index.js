import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/AuthRoutes.js";
import messageRoutes from "./routes/MessageRoutes.js";
import { Server } from "socket.io";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads/images", express.static("uploads/images"));
app.use("/uploads/recordings", express.static("uploads/recordings"));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

const io = new Server(server, {
  cors: {
    // origin: process.env.CLIENT_ORIGIN,
    origins: [process.env.CLIENT_ORIGIN, "http://localhost:3000"],
  },
});
io.engine.on("connection_error", (err) => {
  console.log(err.req); // the request object
  console.log(err.code); // the error code, for example 1
  console.log(err.message); // the error message, for example "Session ID unknown"
  console.log(err.context); // some additional error context
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("online-users", {
      onlineUsers: Array.from(onlineUsers.keys()),
    });
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("rcv-msg", {
        from: data.from,
        message: data.message,
      });
    }
  });

  socket.on("outgoing-voice-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    console.log("received voice call", "from"+data.from, " to: "+data.to);

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("rcv-voice-call", {
        from: data.from,
        callType: data.callType,
        roomId: data.roomId,
      });
    }
  });

  socket.on("outgoing-video-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    console.log("received video call", "from"+data.from, " to: "+data.to);

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("rcv-video-call", {
        from: data.from,
        callType: data.callType,
        roomId: data.roomId,
      });
      // console.log("call sent")
    }
  });

  socket.on("reject-voice-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.from);
    console.log("recived reject call for", data.from);

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("rejected-voice-call");
    }
  });

  socket.on("reject-video-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.from);
    console.log("recived reject call for", data.from);

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("rejected-video-call");
    }
  });

  socket.on("accept-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.id);
    console.log("User accepted the call", data.id);

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("accepted-call", {
        id: data.id,
      });
    }
  });

  socket.on("signout", (data) => {
    onlineUsers.delete(data.id);
    console.log("user signout: ",data.id);
    socket.broadcast.emit("online-users", {
      onlineUsers: Array.from(onlineUsers.keys()),
    });
  });
});
