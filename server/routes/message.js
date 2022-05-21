const router = require("express").Router();
const messageController = require("../controller/messageController");

router.get("/:room", messageController.messages);

module.exports = router;
