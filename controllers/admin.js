const {sendApiResponse} = require("../utils/response");
const HTTP_STATUS = require("../utils/httpStatus");
const messages = require("../utils/message");
const User = require("../models/user");
const Task = require("../models/task");

async function getUsers(req, res) {
    try {
        const { page = 1, limit = 10 } = req.query;

        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

        const total = await User.countDocuments();
        const users = await User.find()
            .sort({ createdAt: -1})
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        const meta = {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum) || 1,
        };

        return sendApiResponse(res, HTTP_STATUS.OK, messages.USERS_FETCHED, { items: users, meta });
    } catch (error) {
        return sendApiResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, messages.SERVER_ERROR, error);
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return sendApiResponse(res, HTTP_STATUS.NOT_FOUND, messages.USER_NOT_FOUND);
        }
        await Task.deleteMany({ userId: id });
        return sendApiResponse(res, HTTP_STATUS.OK, messages.USER_DELETED);
    } catch (error) {
        return sendApiResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, messages.SERVER_ERROR, error);
    }
}

async function getTasks(req, res) {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

        const filter = {};
        if (status) {
            const normalized = String(status).toUpperCase();
            const allowed = ["PENDING", "IN_PROGRESS", "COMPLETED"];
            if (!allowed.includes(normalized)) {
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

module.exports = {
    getUsers,
    deleteUser,
    getTasks
};