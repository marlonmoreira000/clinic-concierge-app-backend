const express = require("express");
const app = express();
require('dotenv').config()
const dbConfig = require("./config/dbConfig");
const cors = require('cors'); 
app.use(express.json());
const authRoute = require("./routes/authRoute");
const refreshTokenRoute = require("./routes/refreshTokenRoute");
const apiV1Routes =require("./routes")
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json())
app.use("/api/v1/", authRoute);
app.use("/api/v1/refreshToken", refreshTokenRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1", apiV1Routes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
