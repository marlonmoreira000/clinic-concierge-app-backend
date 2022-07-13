const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // one day
  },
});

const tokenModel = mongoose.model("Tokens", tokenSchema);

module.exports = tokenModel;
