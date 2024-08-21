//import the User Model defenition from the user file
const Admin = require("../models/Admin");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Provider = require("../models/Provider");
const Shift = require("./Shift");
const ServiceAgreement = require("./ServiceAgreement");
const Product = require("../models/Product");
const Service = require("../models/Service");

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
