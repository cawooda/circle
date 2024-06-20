require("dotenv").config();
const PORT = process.env.PORT || 5000;
const express = require("express");
const app = express();

//require the connection to database
const db = require("./config/connection");
//import the routes
const routes = require("./routes/index");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", routes);

db.once("open", () => {
  app.listen(
    PORT,
    console.log(`server running on port ${PORT} http://localhost:${PORT}`)
  );
});
