const HTTP_STATUS = require("../utils/httpStatus");
const messages = require("../utils/message");
const bcrypt = require("bcrypt");
const User = require("../models/user");

async function registerUser(req, res) {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: messages.USER_ALREADY_EXISTS });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: messages.USER_REGISTERED_SUCCESSFULLY });
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: messages.SERVER_ERROR, error });
  }
}

async function loginUser(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: messages.USER_NOT_FOUND });
    }
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: messages.INVALID_PASSWORD });
    }
    res
      .status(HTTP_STATUS.OK)
      .json({ message: messages.LOGIN_SUCCESSFUL, user });
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: messages.SERVER_ERROR, error });
  }
}

module.exports = {
  registerUser,
  loginUser,
};