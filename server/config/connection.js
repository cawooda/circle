require("dotenv").config();
const { connect, connection, model } = require("mongoose");

const connectionString = process.env.MONGO_CONNECTION_STRING;

connect(connectionString);

// const providerCollection = connection.collection("provider");
// const customerCollection = connection.collection("customer");
// const userCollection = connection.collection("user");
// const adminCollection = connection.collection("admin");
// const serviceCollection = connection.collection("service");

// const customerChangeStream = customerCollection.watch();
// const userChangeStream = userCollection.watch();
// const providerChangeStream = providerCollection.watch();
// const adminChangeStream = adminCollection.watch();
// const serviceChangeStream = serviceCollection.watch();

// customerChangeStream.on("change", async (change) => {
//   if (change.operationType === "delete") {
//     const deleteCustomerId = change.documentKey._id;
//     const providers = providerCollection.find({
//       linkedCustomers: { $in: [deleteCustomerId] },
//     });
//     providers.map((provider) => {
//       console.log(provider);
//       linkedCustomers.map((linkedCustomer) => {
//         console.log(linkedCustomer);
//       });
//     });
//   }
// });

module.exports = connection;
