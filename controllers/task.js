const {sendApiResponse} = require("../utils/response");
const HTTP_STATUS = require("../utils/httpStatus");
const messages = require("../utils/message");
const Task = require("../models/task");
const bcrypt = require("bcrypt");

async function createTask(req, res) {
    try {
        const { title, description, status } = req.body;
        let user = req.headers.user;
        if(!title || !description || !status) {
            return sendApiResponse(res, HTTP_STATUS.BAD_REQUEST, messages.TASK_REQUIRED_FIELDS);
        }
                const task = await Task.findOne({ title: title, userId: user._id });
                if (task) {
                    return sendApiResponse(res, HTTP_STATUS.BAD_REQUEST, messages.TASK_ALREADY_EXISTS);
                }

        const newTask = new Task({ userId: user._id, title, description, status});
        await newTask.save();
        return sendApiResponse(res, HTTP_STATUS.CREATED, messages.TASK_CREATED, newTask);
    } catch (error) {
        return sendApiResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, messages.SERVER_ERROR, error);
    }
}

async function getTasks(req, res) {
    try {
        const user = req.headers.user;
        const { status, page = 1, limit = 10 } = req.query;

        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

        const filter = { userId: user._id };
        if (status) {
            const normalized = String(status).toUpperCase();
            if (!["PENDING", "IN_PROGRESS", "COMPLETED"].includes(normalized)) {
                return sendApiResponse(res, HTTP_STATUS.BAD_REQUEST, "Invalid status filter. Use PENDING, IN_PROGRESS, or COMPLETED.");
            }
            filter.status = normalized;
        }

        const total = await Task.countDocuments(filter);
        const tasks = await Task.find(filter)
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        const meta = {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum) || 1,
        };

        return sendApiResponse(res, HTTP_STATUS.OK, messages.TASKS_FETCHED, { items: tasks, meta });
    } catch (error) {
        return sendApiResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, messages.SERVER_ERROR, error);
    }
}

async function updateTask(req, res) {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;
        if(!title && !description && !status) {
            return sendApiResponse(res, HTTP_STATUS.BAD_REQUEST, "No fields to update provided");
        }
        let user = req.headers.user;
        const task = await Task.findOne({ _id: id, userId: user._id });
        if (!task) {
            return sendApiResponse(res, HTTP_STATUS.NOT_FOUND, messages.TASK_NOT_FOUND);
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;

        await task.save();
        return sendApiResponse(res, HTTP_STATUS.OK, messages.TASK_UPDATED, task);
    } catch (error) {
        return sendApiResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, messages.SERVER_ERROR, error);
    }
}

async function deleteTask(req, res) {
    try {
        const { id } = req.params;
        let user = req.headers.user;

        const task = await Task.findOneAndDelete({ _id: id, userId: user._id });
        if (!task) {
            return sendApiResponse(res, HTTP_STATUS.NOT_FOUND, messages.TASK_NOT_FOUND);
        }

        return sendApiResponse(res, HTTP_STATUS.OK, messages.TASK_DELETED);
    } catch (error) {
        return sendApiResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, messages.SERVER_ERROR, error);
    }
}



module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
};

