const {
  User,
  Admin,
  Customer,
  Provider,
  Product,
  ServiceAgreement,
} = require("../models");
const { roles } = require("../utils/roles");
const jwt = require("jsonwebtoken");

//handling SMS for this resolver
const { SMSService } = require("../utils/smsService");
const controllerSmsService = new SMSService();

const smsService = new SMSService();

const resolvers = {
  Query: {
    getAllUsers: async () => {
      try {
        const users = await User.find({}).populate();
        console.log(users);
        return users;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    getUserById: async (_parent, { id }) => {
      const user = await User.findById(id)
        .populate("roleCustomer")
        .populate("roleProvider")
        .populate("roleAdmin");
      return user;
    },
    getCustomers: async (_parent, { id }) => {
      try {
        const customers = await Customer.find({}).populate("user");
        console.log(customers);
        const returnedCustomers = customers.filter((customer) => customer.user);
        return returnedCustomers;
      } catch (error) {
        console.error(error);
      }
    },
    getProducts: async () => {
      try {
        const productList = Product.find({});

        return productList;
      } catch (error) {
        console.error(error);
      }
    },
    getServiceAgreement: async (__parent, { agreementNumber }) => {
      try {
        const serviceAgreement = await ServiceAgreement.findOne({
          agreementNumber: agreementNumber,
        });

        await serviceAgreement.populate("customer");
        await serviceAgreement.populate("provider");
        await serviceAgreement.populate("product");
        await serviceAgreement.populate("customer.user");
        console.log(serviceAgreement);
        return serviceAgreement;
      } catch (error) {
        console.error(error);
      }
    },
    getUserByToken: async (_parent, { token }) => {
      try {
        const { authenticatedPerson } = jwt.verify(
          token,
          process.env.SECRET_KEY,
          {
            maxAge: process.env.TOKEN_EXPIRES_IN,
          }
        );

        const user = await User.findById(authenticatedPerson._id).populate();

        return user;
      } catch (error) {
        throw new Error("Invalid or expired token");
      }
    },

    getUserRoles: async (_parent, { id }) => {
      const user = await User.findById(id);
    },
  },
  Mutation: {
    addServiceAgreement: async (
      _parent,
      { provider, customer, startDate, quantity, product, endDate }
    ) => {
      try {
        const newServiceAgreement = await ServiceAgreement.create({
          provider: provider || null,
          customer: customer || null,
          startDate: new Date() || null,
          product: product || null,
          quantity: quantity || null,
          endDate: endDate || null,
        });
        // Populate paths individually to fix an issue I cant trace
        await newServiceAgreement.populate("customer");
        await newServiceAgreement.populate("provider");
        await newServiceAgreement.populate("customer.user");
        await newServiceAgreement.populate("provider.user");
        newServiceAgreement.save();
        controllerSmsService.sendText(
          newServiceAgreement.customer.user.mobile,
          `Hi ${newServiceAgreement.customer.user.first}, a new service agreement with ${newServiceAgreement.provider.providerName} agreement is ready. Use the link to securely review and sign ;)
        `,
          `/customer/agreement/${newServiceAgreement.agreementNumber}`
        );

        return newServiceAgreement;
      } catch (error) {
        console.error(error);
      }
    },
    signServiceAgreement: async (_parent, { agreementId, signature }) => {
      try {
        const signedServiceAgreement = await ServiceAgreement.findById(
          agreementId
        );
        if (signature) {
          signedServiceAgreement.approvedByCustomer = true;
        }
        // Populate paths individually to fix an issue I cant trace
        await signedServiceAgreement.populate("customer");
        await signedServiceAgreement.populate("provider");
        await signedServiceAgreement.populate("customer.user");
        await signedServiceAgreement.populate("provider.user");
        await signedServiceAgreement.save();
        controllerSmsService.sendText(
          signedServiceAgreement.provider.user.mobile,
          `Hi ${signedServiceAgreement.provider.user.first}, a new service agreement with ${signedServiceAgreement.customer.user.first} has been signed. ;)`
        );

        return signedServiceAgreement;
      } catch (error) {
        console.error(error);
      }
    },
    toggleUserRole: async (_parent, { userId, role }) => {
      try {
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }
        switch (role) {
          case "admin":
            if (user.roleAdmin) {
              console.log("Deleting provider with ID:", user.roleAdmin);
              console.log(
                await Admin.findOneAndDelete({
                  _id: user.roleAdmin,
                })
              );
              user.roleAdmin = null;
              await user.save(); // Update user document
            } else {
              const newAdmin = await Admin.create({ user: user._id });
              user.roleAdmin = newAdmin._id;
            }
            await user.save();
            break;
          case "provider":
            if (user.roleProvider) {
              console.log("Deleting provider with ID:", user.roleProvider);
              console.log(
                await Provider.findOneAndDelete({
                  _id: user.roleProvider,
                })
              );
              user.roleProvider = null;
              await user.save(); // Update user document
            } else {
              const newProvider = await Provider.create({
                user: user._id,
                abn: require("../utils/helpers").generateRandomNumber(
                  9999999999,
                  10000000000
                ),
                address: "1 Street Name, Town, PostCode",
                providerName: "Acme Electronics",
                termsAndConditions: [
                  {
                    heading: "Important Terms",
                    paragraph:
                      "Important ParagraphImportant ParagraphImportant ParagraphImportant ParagraphImportant ParagraphImportant ParagraphImportant ParagraphImportant ParagraphImportant ParagraphImportant Paragraph",
                  },
                ],
              });
              user.roleProvider = newProvider._id;
            }
            await user.save();
            break;
          case "customer":
            if (user.roleCustomer) {
              await Customer.findOneAndDelete({
                _id: user.roleCustomer,
              });
              user.roleCustomer = null;
              await user.save();
            } else {
              const newCustomer = await Customer.create({
                user: user._id,
                ndisNumber: require("../utils/helpers").generateRandomNumber(
                  1000000000,
                  9999999999
                ),
                address: "1 Street Name, Town, PostCode",
                dateOfBirth: new Date(1990, 0, 1), // Example date of birth
                customerSpecificField: "Specific details about the customer",
              });
              user.roleCustomer = newCustomer._id;
            }
            await user.save();
            break;

          default:
            throw new Error("Invalid role");
        }

        console.log("Updated user:", user);
        return user;
      } catch (error) {
        console.error("Error in toggleUserRole:", error);
        throw new Error("Failed to toggle user role");
      }
    },
    updateProfile: async (_parent, { userId, first, last, mobile, email }) => {
      try {
        const updatedUser = await User.findById(userId);
        if (!updatedUser) {
          throw new Error("User not found");
        } else {
          await updatedUser.updateOne({
            first: first,
            last: last,
            mobile: mobile,
            email: email,
          });
          await updatedUser.save();
        }
        return updatedUser;
      } catch (error) {}
    },
    updateUserPassword: async (_parent, { userId, password }) => {
      try {
        const updatedUser = await User.findById(userId);
        if (!updatedUser) {
          throw new Error("User not found");
        } else {
          updatedUser.password = password;
          await updatedUser.save();
        }
        return updatedUser;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = resolvers;
