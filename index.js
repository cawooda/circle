require("dotenv").config();
const express = require("express");
const router = require("./routes/index");

const PORT = process.env.PORT || 5000;
const app = express();

app.use("/api", router);

app.listen(
  PORT,
  console.log(`server running on port ${PORT} http://localhost:${PORT}`)
);
