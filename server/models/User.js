const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: "Name is required",
  },
});

module.exports = mongoose.model("User", userSchema);