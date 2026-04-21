//Connect to database and seed with test data
const connection = require("../config/connection");
require("dotenv").config();

//security measures to prevent seeding in production
const isProd = process.env.NODE_ENV || "development";
const seedOK = process.env.SEED_OK || false;

const {
  User,
  Admin,
  Provider,
  Product,
  Service,
  Shift,
  ServiceAgreement,
} = require("../models");

const {
  userSeed,
  providerSeed,
  productSeed,
  serviceSeed,
  shiftSeed,
  agreementSeed,
} = require("./seedData");

// Set the callback to occur once the connection opens
if (seedOK && isProd === "development") {
  connection.once("open", async () => {
    try {
      // Seed Users
      for (let user of userSeed) {
        const userExistsAlready = await User.findOne({ mobile: user._id });
        if (!userExistsAlready) {
          const newUser = await User.create(user);
          newUser.password = user.password;
          const roleAdmin = new Admin({ user: newUser._id });
          await roleAdmin.save();
          newUser.roleAdmin = roleAdmin._id;
          const roleProvider = new Provider({ user: newUser._id });
          await roleProvider.save();
          newUser.roleProvider = roleProvider._id;
          await newUser.save();
          console.log(`Added user: ${user.first} ${user.last}`);
        } else {
          console.log(`User ${user.first} ${user.last} already exists.`);
        }
      }

      const users = await User.find({}).lean();

      console.table(
        users.map((u) => ({ name: `${u.first} ${u.last}`, mobile: u.mobile })),
      );

      // Seed Providers
      // a provider is created for each user automatically in the schema.
      // the following code should cycle through the providerSeed and update the provider details for each user, without creating duplicates.

      for (let provider of providerSeed) {
        const existingProvider = await Provider.findOne({ _id: provider._id });
        if (!existingProvider) {
          const newProvider = await Provider.create(provider);
          console.log(`Added provider for user: ${provider.user}`);
        } else {
          await Provider.updateOne(
            { _id: provider._id },
            { $set: { ...provider } },
          );
          console.log(`Updated provider for user: ${provider.user}`);
        }
      }

      const providers = await Provider.find({}).lean();

      console.table(
        providers.map((p) => ({ providerName: p.providerName, _id: p._id })),
      );

      // Seed Products
      for (let product of productSeed) {
        const existingProduct = await Product.findOne({ _id: product._id });
        if (!existingProduct) {
          await Product.create(product);
          console.log(`Added product: ${product.name}`);
        } else {
          console.log(`Product ${product.name} already exists.`);
        }
      }

      const products = await Product.find({}).lean();

      console.table(products.map((p) => ({ name: p.name, _id: p._id })));

      // Seed Services
      for (let service of serviceSeed) {
        const { _id, provider, product, ...serviceData } = service;
        const writeResult = await Service.updateOne(
          { provider, product },
          {
            $set: { provider, product, ...serviceData },
            $setOnInsert: { _id },
          },
          { upsert: true },
        );
        if (writeResult.upsertedCount > 0) {
          console.log(
            `Added service: provider=${provider} product=${product} (_id=${_id})`,
          );
        } else if (writeResult.modifiedCount > 0) {
          console.log(
            `Updated service: provider=${provider} product=${product}`,
          );
        } else {
          console.log(
            `Service unchanged: provider=${provider} product=${product}`,
          );
        }
      }

      const services = await Service.find({});
      console.table(
        services.map((s) => ({
          _id: s._id,
          provider: s.provider,
          product: s.product,
          price: s.price,
        })),
      );

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

      const shifts = await Shift.find({}).lean();

      console.table(
        shifts.map((s) => ({
          _id: s._id,
          customer: s.customer,
          provider: s.provider,
          service: s.service,
          startTime: s.startTime,
          endTime: s.endTime,
        })),
      );

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

      const agreements = await ServiceAgreement.find({}).lean();

      console.table(
        agreements.map((a) => ({
          _id: a._id,
          agreementNumber: a.agreementNumber,
          provider: a.provider,
          customer: a.customer,
          service: a.service,
          startDate: a.startDate,
          endDate: a.endDate,
        })),
      );
    } catch (error) {
      console.error("Error seeding the database", error);
    } finally {
      connection.close();
    }
  });
} else {
  console.log(
    "Seeding skipped. To seed the database, set SEED_OK=true in your .env file and ensure NODE_ENV is not set to 'production'.",
  );
}
