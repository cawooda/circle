require("dotenv").config();
const { connect, connection } = require("mongoose");
const connectionString = process.env.MONGO_CONNECTION_STRING;

connect(connectionString);

module.exports = connection;
