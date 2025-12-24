const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
            default: "PENDING",
        }
    }
)

const Task = mongoose.model("task", taskSchema);
module.exports = Task;