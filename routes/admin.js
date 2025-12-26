const express = require("express");
const { authMiddleware, roleMiddleware } = require("../middlewares/auth");
const {getUsers, deleteUser, getTasks} = require("../controllers/admin");

const router = express.Router();

router.get("/getUsers", authMiddleware, roleMiddleware(["ADMIN"]), getUsers);
router.delete("/deleteUser/:id", authMiddleware, roleMiddleware(["ADMIN"]), deleteUser);
router.get("/getTasks", authMiddleware, roleMiddleware(["ADMIN"]), getTasks);

module.exports = router;