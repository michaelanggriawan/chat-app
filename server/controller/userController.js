const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.register = async (req, res) => {
  const { username } = req.body;
  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(409).json({ message: "User already exist" });
  } else {
    const user = new User({ username });

    await user.save();

    res.json({ message: "User is created" });
  }
};
