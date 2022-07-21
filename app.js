// imports
require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoute = require("./routes/authRoute");
const refreshTokenRoute = require("./routes/refreshTokenRoute");
const apiV1Routes = require("./routes/index.js");

app.use("/api/v1/", authRoute);
app.use("/api/v1/refreshToken", refreshTokenRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1", apiV1Routes);

module.exports = app;
