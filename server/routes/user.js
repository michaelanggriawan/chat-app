const router = require("express").Router();
const userController = require("../controller/userController");

router.post("/register", userController.register);

module.exports = router;
