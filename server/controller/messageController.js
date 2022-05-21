const mongoose = require("mongoose");
const Message = mongoose.model("Message");
const Chatroom = mongoose.model("Chatroom");

exports.messages = async (req, res) => {
  const { room: chatroom } = req.params;
  console.log('param', req.params)
  const room = await Chatroom.findOne({ room: chatroom });
  const chats = await Message.find({ chatroom: room._id })
    .populate("username")
    .populate("chatroom");

  const transformResponse = chats.map((chat) => {
    return {
      author: chat.username.username,
      room: chat.chatroom.room,
      _id: chat._id,
      message: chat.message,
      time: chat.time,
    };
  });

  return res.json({ messages: transformResponse });
};
