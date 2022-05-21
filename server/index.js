const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const server = http.createServer(app);
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://michael:copycino1@cluster0.pytjn.mongodb.net/?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
);

mongoose.connection.on("error", (err) => {
  console.log("Mongoose Connection ERROR: " + err.message);
});

mongoose.connection.once("open", () => {
  console.log("MongoDB Connected");
});

require("./models/User");
require("./models/Chatroom");
require("./models/Message");

const Chatroom = mongoose.model("Chatroom");
const Message = mongoose.model("Message");
const User = mongoose.model("User");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methos: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.join("global");
  socket.emit("clientConnected", socket.id);

  socket.on("join_room", async ({ room, username }) => {
    const chatroomExists = await Chatroom.findOne({ room });
    const usernameExists = await User.findOne({ username });

    if (!chatroomExists) {
      const chatroom = new Chatroom({
        room,
      });

      await chatroom.save();
    }

    if (!usernameExists) {
      const user = new User({
        username,
      });

      await user.save();
    }

    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on("online", ({ username, room, socketId }) => {
    socket.to("global").emit("user_online", { username, room, socketId });
  });

  socket.on("send_message", async (data) => {
    const chatroom = await Chatroom.findOne({ room: data.room });
    const username = await User.findOne({ username: data.author });

    const newMessage = new Message({
      chatroom: chatroom._id,
      username: username._id,
      message: data.message,
      time: data.time,
    });

    await newMessage.save();
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    socket.to("global").emit("user_offline", socket.id);
  });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", require("./routes/user"));
app.use("/messages", require("./routes/message"));

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
