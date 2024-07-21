//import the User Model defenition from the user file
const Admin = require("../models/Admin");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Provider = require("../models/Provider");
const Plan = require("../models/Plan");
const Agreement = require("./ServiceAgreement");
const Product = require("../models/Product");

module.exports = { User, Customer, Admin, Provider, Plan, Agreement, Product };
