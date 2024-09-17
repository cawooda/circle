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
} = require("../models");

const {
  userSeed,
  customerSeed,
  providerSeed,
  productSeed,
  serviceSeed,
  shiftSeed,
  agreementSeed,
} = require("./seedData");

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
    console.log("Dropping and recreating collections...");

    // Drop the collections if they exist
    await User.collection.drop();
    await Customer.collection.drop();
    await Provider.collection.drop();
    await Product.collection.drop();
    await Service.collection.drop();
    await Shift.collection.drop();
    await ServiceAgreement.collection.drop();

    // Seed Users
    for (let user of userSeed) {
      user.password = await hashPassword(user.password);
      await User.create(user);
      console.log(`Added user: ${user.first} ${user.last}`);
    }

    // Seed Customers
    await Customer.insertMany(customerSeed);
    console.log("Customers seeded.");

    // Seed Providers
    await Provider.insertMany(providerSeed);
    console.log("Providers seeded.");

    // Seed Products
    await Product.insertMany(productSeed);
    console.log("Products seeded.");

    // Seed Services
    await Service.insertMany(serviceSeed);
    console.log("Services seeded.");

    // Seed Shifts
    await Shift.insertMany(shiftSeed);
    console.log("Shifts seeded.");

    // Seed Agreements
    await ServiceAgreement.insertMany(agreementSeed);
    console.log("Service Agreements seeded.");
  } catch (error) {
    console.error("Error seeding the database", error);
  } finally {
    connection.close();
    console.log("Database seeding complete. Connection closed.");
  }
});
