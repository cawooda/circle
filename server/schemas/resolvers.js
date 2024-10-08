const path = require("path");
const dayjs = require("dayjs");
const { ServiceAgreement } = require("../models");

//handling SMS for this resolver

const { generateRandomNumber } = require("../utils/helpers");

const {
  getAllUsers,
  getMe,
  getCustomers,
  getUserByToken,
  getUserRoles,
  toggleUserRole,
  updateProfile,
  updateUserPassword,
} = require("./resolvers.user");
const { updateProviderProfile } = require("./resolvers.provider");
const {
  addService,
  deleteService,
  updateServicePrice,
  getServices,
} = require("./resolvers.service");
const {
  addServiceAgreement,
  signServiceAgreement,
  getServiceAgreements,
  getServiceAgreement,
} = require("./resolvers.serviceAgreement");

const { getMyProvider } = require("./resolvers.provider");
const { addCustomer } = require("./resolvers.customer");

const { getProducts } = require("./resolvers.product");

const resolvers = {
  Query: {
    getAllUsers,
    getMe,
    getCustomers,
    getProducts,
    getUserByToken,
    getUserRoles,
    getServices,
    getServiceAgreement,
    getServiceAgreements,
    getMyProvider,
  },
  Mutation: {
    addServiceAgreement,
    signServiceAgreement,
    addCustomer,
    updateProviderProfile,
    toggleUserRole,
    updateProfile,
    updateUserPassword,
    addService,
    deleteService,
    updateServicePrice,
  },
};

module.exports = resolvers;
