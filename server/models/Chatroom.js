const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
  room: {
    type: String,
    required: "room is required",
  },
});

module.exports = mongoose.model("Chatroom", chatroomSchema);
