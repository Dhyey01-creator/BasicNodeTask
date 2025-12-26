const { registerUser, loginUser } = require("../controllers/user");
const express = require("express");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;