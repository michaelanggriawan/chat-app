const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatroom: {
    type: mongoose.Schema.Types.ObjectId,
    required: "Chatroom is required",
    ref: "Chatroom",
  },
  username: {
    type: mongoose.Schema.Types.ObjectId,
    required: "User is required",
    ref: "User",
  },
  message: {
    type: String,
    required: "Message is required",
  },
  time: {
    type: String,
    required: "Time is required",
  },
});

module.exports = mongoose.model("Message", messageSchema);
