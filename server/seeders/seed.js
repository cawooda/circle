//require the connection to database
const connection = require("../config/connection");

//setup user
const { User, Customer } = require("../models");
const userSeed = require("./userSeed.json");
const customerSeed = require("./customerSeed.json");

//set the callback to occur once the connection opens
connection.once("open", async () => {
  // check if the collections exist
  let userCheck = await connection.db
    .listCollections({ name: "users" })
    .toArray();
  //check if users exists
  if (userCheck.length) {
    await connection.dropCollection("users");
  }
  // insert the data into the database
  users = await User.insertMany(userSeed);

  //check if collection exists
  let customerCheck = await connection.db
    .listCollections({ name: "customers" })
    .toArray();

  if (customerCheck.length) {
    await connection.dropCollection("customers");
  }

  customers = await Customer.insertMany(customerSeed);
  console.table(users);
  console.table(customers);
});
