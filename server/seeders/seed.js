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
    for (let customer of customerSeed) {
      const existingCustomer = await Customer.findOne({ _id: customer._id });
      if (!existingCustomer) {
        await Customer.create(customer);
        console.log(`Added customer: ${customer._id}`);
      } else {
        console.log(`Customer ${customer._id} already exists.`);
      }
    }

    // Seed Providers
    for (let provider of providerSeed) {
      const existingProvider = await Provider.findOne({ _id: provider._id });
      if (!existingProvider) {
        await Provider.create(provider);
        console.log(`Added provider: ${provider.providerName}`);
      } else {
        console.log(`Provider ${provider.providerName} already exists.`);
      }
    }

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
    for (let service of serviceSeed) {
      const existingService = await Service.findOne({ _id: service._id });
      if (!existingService) {
        await Service.create(service);
        console.log(`Added service: ${service._id}`);
      } else {
        console.log(`Service ${service._id} already exists.`);
      }
    }

    // Seed Shifts
    for (let shift of shiftSeed) {
      const existingShift = await Shift.findOne({ _id: shift._id });
      if (!existingShift) {
        await Shift.create(shift);
        console.log(`Added shift: ${shift._id}`);
      } else {
        console.log(`Shift ${shift._id} already exists.`);
      }
    }

    // Seed Agreements
    for (let agreement of agreementSeed) {
      const existingAgreement = await ServiceAgreement.findOne({
        _id: agreement._id,
      });
      if (!existingAgreement) {
        await ServiceAgreement.create(agreement);
        console.log(`Added agreement: ${agreement.agreementNumber}`);
      } else {
        console.log(`Agreement ${agreement.agreementNumber} already exists.`);
      }
    }
  } catch (error) {
    console.error("Error seeding the database", error);
  } finally {
    connection.close();
  }
});
