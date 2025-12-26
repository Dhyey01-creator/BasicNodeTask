const { getUser } = require("../service/auth");
const HTTP_STATUS = require("../utils/httpStatus");
const messages = require("../utils/message");
const { sendApiResponse } = require("../utils/response");

async function authMiddleware(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) {
        return sendApiResponse(res, HTTP_STATUS.UNAUTHORIZED, messages.UNAUTHORIZED);
    }
    const tokenParts = token.split("Bearer ");
    const user = getUser(tokenParts[1]);

    if (!user) {
        return sendApiResponse(res, HTTP_STATUS.UNAUTHORIZED, messages.UNAUTHORIZED);
    }

    req.headers.user = user;

    next();
}

function roleMiddleware(requiredRole) {
    return function (req, res, next) {
        const user = req.headers.user;
        const userRole = user && user.role;

        if (!userRole) {
            return sendApiResponse(res, HTTP_STATUS.NOT_FOUND, messages.USER_NOT_FOUND);
        }

        if (!requiredRole.includes(userRole)) {
            return sendApiResponse(res, HTTP_STATUS.UNAUTHORIZED, messages.UNAUTHORIZED);
        }

        next();
    }
}

module.exports = {
    authMiddleware,
    roleMiddleware
};