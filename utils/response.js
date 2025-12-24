const {http_status} = require("../utils/httpStatus");
const {messages} = require("../utils/message");

const sendApiResponse = (
  res,
  statusCode = http_status.OK,
  message = "",
  data = {},
  error = {}
) => {
  return res.status(statusCode).json({
    status: statusCode,
    message,
    data,
    error: Object.keys(error).length === 0 ? {} : error
  });
};

module.exports = { sendApiResponse };
