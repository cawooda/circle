const path = require("path");
const dayjs = require("dayjs");
const { ServiceAgreement } = require("../../models");

//handling SMS for this resolver

const { generateRandomNumber } = require("../../utils/helpers");

const {
  getMe,
  createUser,
  passwordReset,
  updatePassword,
  login,
  updateUserProfile,
  logout,
} = require("./resolvers.user");

const resolvers = {
  Query: {
    getMe,
  },
  Mutation: {
    createUser,
    login,
    updateUserProfile,
    passwordReset,
    updatePassword,
    logout,
  },
};

module.exports = resolvers;
