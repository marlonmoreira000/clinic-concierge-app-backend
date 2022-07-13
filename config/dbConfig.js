const mongoose = require("mongoose");

mongoose.connect(process.env.ATLAS_DB_URL);

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("MongoDB is connected");
});

connection.on("error", (err) => {
  console.log("MongoDB error", err);
});

connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

module.exports = mongoose;
