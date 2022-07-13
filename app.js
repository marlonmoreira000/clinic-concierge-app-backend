const express = require("express");
const app = express();
require('dotenv').config()
const dbConfig = require("./config/dbConfig");
app.use(express.json());
const authRoute = require("./routes/authRoute");
const refreshTokenRoute = require("./routes/refreshTokenRoute");
const port = process.env.PORT || 4000;


app.use("/api/v1/", authRoute);
app.use("/api/v1/refreshToken", refreshTokenRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
