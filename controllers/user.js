const HTTP_STATUS = require("../utils/httpStatus");
const { sendApiResponse } = require("../utils/response");
const messages = require("../utils/message");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { setUser } = require("../service/auth");

async function registerUser(req, res) {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendApiResponse(res, HTTP_STATUS.BAD_REQUEST, messages.USER_ALREADY_EXISTS);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    return sendApiResponse(res, HTTP_STATUS.CREATED, messages.USER_REGISTERED_SUCCESSFULLY);
  } catch (error) {
    return sendApiResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, messages.SERVER_ERROR, error);
  }
}

async function loginUser(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return sendApiResponse(res, HTTP_STATUS.UNAUTHORIZED, messages.USER_NOT_FOUND);
    }
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return sendApiResponse(res, HTTP_STATUS.UNAUTHORIZED, messages.INVALID_PASSWORD);
    }
    const token = setUser(user);
    return sendApiResponse(res, HTTP_STATUS.OK, messages.LOGIN_SUCCESSFUL, { token, user });
  } catch (error) {
    return sendApiResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, messages.SERVER_ERROR, error);
  }
}

module.exports = {
  registerUser,
  loginUser,
};