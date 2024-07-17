//import the User Model defenition from the user file
const User = require("../models/User");
const Customer = require("../models/Customer");
const Admin = require("../models/Admin");
const Provider = require("../models/Provider");
const Plan = require("../models/Plan");
const Agreement = require("../models/Agreement");

module.exports = { User, Customer, Admin, Provider, Plan, Agreement };
