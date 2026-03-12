const path = require("path");
const dayjs = require("dayjs");
const { ServiceAgreement } = require("../models");

//handling SMS for this resolver

const { generateRandomNumber } = require("../utils/helpers");

const {
  getMe,
  getAllUsers,
  getAllProducts,
  getAllProviderServices,
  getAllProviderServiceAgreements,
  getServiceAgreement,
  addUser,
  passwordReset,
  updatePassword,
  login,
  addServiceAgreement,
  signServiceAgreement,
  toggleUserRole,
  updateUserProfile,
  updateProviderProfile,
  addNewCustomerToProvider,
  deleteServiceFromProvider,
} = require("./resolvers.user");

const resolvers = {
  Query: {
    getMe,
    getAllUsers,
    getAllProducts,
    getAllProviderServices,
    getAllProviderServiceAgreements,
    getServiceAgreement,
  },
  Mutation: {
    addUser,
    login,
    passwordReset,
    updatePassword,
    addServiceAgreement,
    signServiceAgreement,
    toggleUserRole,
    updateUserProfile,
    updateProviderProfile,
    addNewCustomerToProvider,
    deleteServiceFromProvider,
  },
};

module.exports = resolvers;
