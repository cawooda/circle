// require the connection to the database
const connection = require("../config/connection");

// setup user, customer, provider, and product models
const {
  User,
  Customer,
  Admin,
  Provider,
  Product,
  Service,
  Shift,
  ServiceAgreement,
} = require("../models");

// Set the callback to occur once the connection opens
connection.once("open", async () => {
  try {
    await User.collection.drop();
    await Admin.collection.drop();
    await Customer.collection.drop();
    await Provider.collection.drop();
    await Product.collection.drop();
    await Service.collection.drop();
    await Shift.collection.drop();
    await ServiceAgreement.collection.drop();
  } catch (error) {
    console.error("Error dropping collections:", error);
  } finally {
    connection.close();
  }

  console.log("Collections dropped. Database reset complete.");
});
