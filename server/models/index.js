//import the User Model defenition from the user file
const Admin = require("./Admin");
const User = require("./UserOLD");
const Customer = require("./Customer");
const Provider = require("./Provider");
const Shift = require("./Shift");
const ServiceAgreement = require("./ServiceAgreement");
const Product = require("./Product");
const Service = require("./Service");

module.exports = {
  User,
  Customer,
  Admin,
  Service,
  Provider,
  Shift,
  ServiceAgreement,
  Product,
};
