// require the connection to the database
const connection = require("../config/connection");

// setup user, customer, provider, and product models
const {
  User,
  Customer,
  Provider,
  Product,
  Service,
  Shift,
  ServiceAgreement,
  // Use the correct model name here
} = require("../models");

const userSeed = require("./userSeed.json");
const customerSeed = require("./customerSeed.json");
const providerSeed = require("./provderSeed.json");
const productSeed = require("./productSeed.json");
const serviceSeed = require("./serviceSeed.json");
const shiftSeed = require("./shiftSeed.json");
const agreementSeed = require("./agreementSeed.json");

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
    // Seed Users
    for (let user of userSeed) {
      const existingUser = await User.findOne({ mobile: user.mobile });
      if (!existingUser) {
        user.password = await hashPassword(user.password);
        await User.create(user);
        console.log(`Added user: ${user.first} ${user.last}`);
      } else {
        console.log(`User ${user.first} ${user.last} already exists.`);
      }
    }

    // Seed Customers
    let customerCheck = await connection.db
      .listCollections({ name: "customers" })
      .toArray();
    if (customerCheck.length && process.env.DEVELOPMENT) {
      await connection.dropCollection("customers");
    }
    const customers = await Customer.insertMany(customerSeed);
    console.table(customers);

    // Seed Providers
    let providerCheck = await connection.db
      .listCollections({ name: "providers" })
      .toArray();
    if (providerCheck.length && process.env.DEVELOPMENT) {
      await connection.dropCollection("providers");
    }
    const providers = await Provider.insertMany(providerSeed);
    console.table(providers);

    // Seed Products
    let productCheck = await connection.db
      .listCollections({ name: "products" })
      .toArray();
    if (productCheck.length && process.env.DEVELOPMENT) {
      await connection.dropCollection("products");
    }
    const products = await Product.insertMany(productSeed);
    console.table(products);

    // Seed Services
    let serviceCheck = await connection.db
      .listCollections({ name: "services" })
      .toArray();
    if (serviceCheck.length && process.env.DEVELOPMENT) {
      await connection.dropCollection("services");
    }
    const services = await Service.insertMany(serviceSeed);
    console.table(services);

    // Seed Shifts
    let shiftCheck = await connection.db
      .listCollections({ name: "shifts" })
      .toArray();
    if (shiftCheck.length && process.env.DEVELOPMENT) {
      await connection.dropCollection("shifts");
    }
    const shifts = await Shift.insertMany(shiftSeed);
    console.table(shifts);

    // Seed Agreements
    let agreementsCheck = await connection.db
      .listCollections({ name: "agreements" })
      .toArray();
    if (agreementsCheck.length && process.env.DEVELOPMENT) {
      await connection.dropCollection("agreements");
    }
    const agreements = await ServiceAgreement.insertMany(agreementSeed);
    console.table(agreements);
  } catch (error) {
    console.error("Error seeding the database", error);
  } finally {
    connection.close();
  }
});
