const path = require("path");
const dayjs = require("dayjs");
const { ServiceAgreement } = require("../models");

//handling SMS for this resolver

const { generateRandomNumber } = require("../utils/helpers");

const {
  getMe,
  addUser,
  passwordReset,
  updatePassword,
  login,
} = require("./resolvers.user");

const resolvers = {
  Query: {
    getMe,
  },
  Mutation: {
    addUser,
    login,
    passwordReset,
    updatePassword,
  },
};

module.exports = resolvers;
