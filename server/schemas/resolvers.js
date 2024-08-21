const path = require("path");
const dayjs = require("dayjs");
const {
  User,
  Admin,
  Customer,
  Provider,
  Product,
  ServiceAgreement,
} = require("../models");

const { renderTemplate } = require("../templates/renderTemplate");
const { convertToPdf } = require(".././utils/pdfUtility");

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
    getServiceAgreement: async (__parent, { agreementNumber }, context) => {
      try {
        const serviceAgreement = await ServiceAgreement.findOne({
          agreementNumber: agreementNumber,
        });
        await serviceAgreement.populate({
          path: "customer",
          populate: { path: "user" },
        });
        await serviceAgreement.populate({
          path: "provider",
          populate: { path: "user" },
        });
        await serviceAgreement.populate({
          path: "product",
          populate: { path: "name price" },
        });

        await serviceAgreement.toObject();
        const stringedContextId = String(serviceAgreement?.customer?.user?._id);
        const stringedCustomerUserId = String(
          serviceAgreement.customer.user._id
        );
        const stringedProviderUserId = String(
          serviceAgreement.provider.user._id
        );

        if (stringedCustomerUserId !== stringedContextId) {
          if (stringedProviderUserId !== String(context.user._id)) {
            throw new Error(
              "user does not match the customer or provider of the agreement"
            );
          }
        }

        return serviceAgreement;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
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
