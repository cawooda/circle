const path = require("path");
const dayjs = require("dayjs");
const { ServiceAgreement } = require("../models");

//handling SMS for this resolver

const { generateRandomNumber } = require("../utils/helpers");

const {
  getAllUsers,
  getMe,
  getCustomers,
  getProducts,
  getUserByToken,
  getUserRoles,
  toggleUserRole,
  updateProfile,
  updateUserPassword,
} = require("./resolvers.user");
const {
  addService,
  deleteService,
  updateServicePrice,
} = require("./resolvers.service");
const {
  addServiceAgreement,
  signServiceAgreement,
  getServiceAgreements,
  getServiceAgreement,
} = require("./resolvers.serviceAgreement");

const resolvers = {
  Query: {
    getAllUsers,
    getMe,
    getCustomers,
    getProducts,
    getUserByToken,
    getUserRoles,
    getServices: async (_parent, { providerId }, context) => {
      return providerServices;
    },
    getServiceAgreement,
    getServiceAgreements,
  },
  Mutation: {
    addServiceAgreement,
    signServiceAgreement,
    toggleUserRole,
    updateProfile,
    updateUserPassword,
    addService,
    deleteService,
    updateServicePrice,
  },
};

module.exports = resolvers;
