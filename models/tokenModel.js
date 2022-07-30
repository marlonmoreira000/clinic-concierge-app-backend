const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  // UserId for which the token is generated
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  // Token value can be access token or refresh token
  token: {
    type: String,
    required: true,
  },
  // When the token was generated
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // one day
  },
});

const tokenModel = mongoose.model("Tokens", tokenSchema);

module.exports = tokenModel;
