require("dotenv").config();
const { connect, connection } = require("mongoose");

connect(process.env.MONGO_CONNECTION_STRING);

module.exports = connection;
