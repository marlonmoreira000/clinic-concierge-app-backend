const Token = require("../models/tokenModel.js");
const jwt = require("jsonwebtoken");

const userToken = await Token.findOne({ userId: user._id });

