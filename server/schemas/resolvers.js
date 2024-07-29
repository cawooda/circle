const {
  User,
  Admin,
  Customer,
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
        return customers;
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
      console.log("agreementNumber", agreementNumber);
      try {
        const serviceAgreement = await ServiceAgreement.findOne({
          agreementNumber: agreementNumber,
        }).populate("customer customer.user product provider");

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
    addUser: async (_parent, { first, last, mobile, email, password }) => {
      try {
        const newUser = await User.create({
          first: first || "",
          last: last || "",
          mobile: mobile,
          email: email || "",
          password,
        });
        return newUser;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    loginUser: async (_parent, { mobile, email, password }) => {
      //find the user
      try {
        const authenticatedUser = await User.findOne({
          $or: [{ mobile: mobile }, { email: email }],
        }).populate();
        //check their password. Model gives them a token if password correct
        if (await authenticatedUser.isCorrectPassword) {
          return authenticatedUser;
        } else {
          console.log("incorrect password");
          return { error: "password incorrect" };
        }
      } catch (error) {
        console.log(error);
      }
    },
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

        controllerSmsService.sendText(
          newServiceAgreement.customer.user.mobile,
          `Hi ${newServiceAgreement.customer.user.first}, a new service agreement with ${newServiceAgreement.provider.providerName} agreement is ready. Use the link to securely review and sign ;)
        `,
          `/support/agreement/${newServiceAgreement.agreementNumber}`
        );
        newServiceAgreement.save();
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
          await signedServiceAgreement.save();
        }
        // Populate paths individually to fix an issue I cant trace
        await signedServiceAgreement.populate("customer");
        await signedServiceAgreement.populate("provider");
        await signedServiceAgreement.populate("customer.user");
        await signedServiceAgreement.populate("provider.user");

        controllerSmsService.sendText(
          signedServiceAgreement.provider.user.mobile,
          `Hi ${signedServiceAgreement.provider.user.first}, a new service agreement with ${signedServiceAgreement.customer.user.first} has been signed. ;)`
        );
        newServiceAgreement.save();
        return newServiceAgreement;
      } catch (error) {
        console.error(error);
      }
    },
    toggleUserRole: async (_parent, { userId, role }) => {
      const user = await User.findById(userId);

      try {
        console.log(user);
      } catch (error) {}
    },
  },
};

module.exports = resolvers;
