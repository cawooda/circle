// require the connection to the database
const connection = require("../config/connection");

// setup user, customer, provider, and product models
const { User, Customer, Provider, Product } = require("../models");
const userSeed = require("./userSeed.json");
const customerSeed = require("./customerSeed.json");
const providerSeed = require("./provderSeed.json");
const productSeed = require("./productSeed.json"); // Include product seed

// require bcrypt for password hashing
const bcrypt = require("bcrypt");
const saltRounds = 10; // Number of rounds to generate the salt

// Function to hash password
const hashPassword = async (password) => {
  return bcrypt.hash(password, saltRounds);
};

// Set the callback to occur once the connection opens
connection.once("open", async () => {
  try {
    // Check if the users collection exists
    let userCheck = await connection.db
      .listCollections({ name: "users" })
      .toArray();
    if (userCheck.length) {
      await connection.dropCollection("users");
    }

    // Hash passwords in userSeed
    for (let user of userSeed) {
      user.password = await hashPassword(user.password);
    }

    // Insert user data into the database
    const users = await User.insertMany(userSeed);

    // Check if the customers collection exists
    let customerCheck = await connection.db
      .listCollections({ name: "customers" })
      .toArray();
    if (customerCheck.length) {
      await connection.dropCollection("customers");
    }
    // Insert customer data into the database
    const customers = await Customer.insertMany(customerSeed);

    // Check if the providers collection exists
    let providerCheck = await connection.db
      .listCollections({ name: "providers" })
      .toArray();
    if (providerCheck.length) {
      await connection.dropCollection("providers");
    }
    // Insert provider data into the database
    const providers = await Provider.insertMany(providerSeed);

    // Check if the products collection exists
    let productCheck = await connection.db
      .listCollections({ name: "products" })
      .toArray();
    if (productCheck.length) {
      await connection.dropCollection("products");
    }
    // Insert product data into the database
    const products = await Product.insertMany(productSeed);

    console.table(users);
    console.table(customers);
    console.table(providers);
    console.table(products);
  } catch (error) {
    console.error("Error seeding the database", error);
  } finally {
    connection.close();
  }
});
