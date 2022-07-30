const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { StatusCodes } = require("http-status-codes");
const UserModel = require("../models/userModel");
dotenv.config();

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.replaceAll("Bearer ", "");
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      async (err, user) => {
        if (err) {
          return res.status(StatusCodes.FORBIDDEN).send({
            error: true,
            message: "Access denied: Invalid or expired token.",
          });
        }
        user = await UserModel.findById(user._id);
        if (!user) {
          return res.status(StatusCodes.FORBIDDEN).send({
            error: true,
            message: "Access denied: Invalid or expired token.",
          });
        }
        req.user = user;
        next();
      }
    );
  } else {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ error: true, message: "Access denied: No token provided." });
  }
};

module.exports = auth;
