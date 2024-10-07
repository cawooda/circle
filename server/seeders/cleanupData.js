// require the connection to the database
const connection = require("../config/connection");

// setup user, customer, provider, and product models
const {
  User,
  Customer,
  Provider,
  Product,
  Admin,
  Service,
  Shift,
  ServiceAgreement,
} = require("../models");

const cleanDatabase = async () => {
  connection.once("open", async () => {
    try {
      // Delete Customers that don't have a corresponding User
      const customersDeleted = await Customer.deleteMany({
        user: { $exists: true, $ne: null, $nin: await User.distinct("_id") },
      });
      console.log(
        `Deleted ${customersDeleted.deletedCount} customers without a user.`
      );

      // Delete Providers that don't have a corresponding User
      const providersDeleted = await Provider.deleteMany({
        user: { $exists: true, $ne: null, $nin: await User.distinct("_id") },
      });
      console.log(
        `Deleted ${providersDeleted.deletedCount} providers without a user.`
      );

      // Delete Admins that don't have a corresponding User
      const adminsDeleted = await Admin.deleteMany({
        user: { $exists: true, $ne: null, $nin: await User.distinct("_id") },
      });
      console.log(
        `Deleted ${adminsDeleted.deletedCount} admins without a user.`
      );

      // Delete Shifts that don't have a Provider, Customer, or Service
      const shiftsDeleted = await Shift.deleteMany({
        $or: [
          { provider: { $exists: true, $nin: await Provider.distinct("_id") } },
          { customer: { $exists: true, $nin: await Customer.distinct("_id") } },
          { service: { $exists: true, $nin: await Service.distinct("_id") } },
        ],
      });
      console.log(
        `Deleted ${shiftsDeleted.deletedCount} shifts without a provider, customer, or service.`
      );

      // Delete Services that don't have a Provider or Product
      const servicesDeleted = await Service.deleteMany({
        $or: [
          { provider: { $exists: true, $nin: await Provider.distinct("_id") } },
          {
            product: {
              $exists: true,
              $nin: await Product.distinct("_id"),
            },
          },
        ],
      });
      console.log(
        `Deleted ${servicesDeleted.deletedCount} services without a provider or product.`
      );

      // Delete Service Agreements without corresponding Providers, Customers, or Services
      const agreementsDeleted = await ServiceAgreement.deleteMany({
        $or: [
          { provider: { $exists: true, $nin: await Provider.distinct("_id") } },
          { customer: { $exists: true, $nin: await Customer.distinct("_id") } },
          { service: { $exists: true, $nin: await Service.distinct("_id") } },
        ],
      });
      console.log(
        `Deleted ${agreementsDeleted.deletedCount} service agreements without a provider, customer, or service.`
      );
    } catch (error) {
      console.error("Error during database cleanup:", error);
    }
  });
};

// Run the cleanup script
cleanDatabase();
