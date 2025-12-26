const express = require("express");
const { authMiddleware, roleMiddleware } = require("../middlewares/auth");
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/task");

const router = express.Router();

router.post("/createTask", authMiddleware, roleMiddleware(["USER"]), createTask);
router.get("/getTask", authMiddleware, roleMiddleware(["USER"]), getTasks);
router.put("/updateTask/:id", authMiddleware, roleMiddleware(["USER"]), updateTask);
router.delete("/deleteTask/:id", authMiddleware, roleMiddleware(["USER"]), deleteTask);

module.exports = router;