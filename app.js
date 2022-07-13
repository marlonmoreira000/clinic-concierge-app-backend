const express = require("express");
const app = express();
require('dotenv').config()
const dbConfig = require("./config/dbConfig");
app.use(express.json());
const patientRoute = require("./routes/patientRoute");
const port = process.env.PORT || 4000;

app.use("/api/v1/patient", patientRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
