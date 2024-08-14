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
const { roles } = require("../utils/roles");
const jwt = require("jsonwebtoken");

const { renderTemplate } = require("../templates/renderTemplate");
const { convertToPdf } = require(".././utils/pdfUtility");

//handling SMS for this resolver
const { SMSService } = require("../utils/smsService");
const { generateRandomNumber } = require("../utils/helpers");
const controllerSmsService = new SMSService();

const smsService = new SMSService();

const resolvers = {
  Query: {
    getAllUsers: async (_parent, {}, context) => {
      const user = await User.findById(context.user._id);
      const admin = await User.findById(context.user.roleAdmin);
      if (admin || user.roleSuperAdmin) {
        try {
          const users = await User.find({}).populate();
          return users;
        } catch (error) {
          console.log(error);
          return error;
        }
      } else
        return { message: "user needs to be admin to perform this action" };
    },
    getMe: async (_parent, {}, context) => {
      const user = await User.findById(context.user._id)
        .populate("roleCustomer")
        .populate("roleProvider")
        .populate("roleAdmin");

      if (user) {
        return user;
      } else {
        return { message: "user not found" };
      }
    },
    getCustomers: async (_parent, { id }, context) => {
      //check what users the context user can get.

      try {
        const customers = await Customer.find({}).populate("user");
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
      { provider, customer, startDate, quantity, product, endDate, signature },
      context
    ) => {
      if (!(context.user.roleProvider._id == provider))
        throw new Error("provider is not in context. not valid");
      productPopulated = await Product.findById(product);
      try {
        const newServiceAgreement = await ServiceAgreement.create({
          provider: provider || null,
          customer: customer || null,
          startDate: new Date() || null,
          product: productPopulated || null,
          quantity: quantity || null,
          endDate: endDate || null,
          providerSignature: signature || null,
        });
        // Populate paths individually to fix an issue I cant trace
        await newServiceAgreement.populate("customer");
        await newServiceAgreement.populate("provider");
        await newServiceAgreement.populate("customer.user");
        await newServiceAgreement.populate("provider.user");
        newServiceAgreement.save();
        newServiceAgreement.customer.user.sendMessage(
          `Hi ${newServiceAgreement.customer.user.first}, a new service agreement with ${newServiceAgreement.provider.providerName} agreement is ready. Use the link to securely review and sign ;)
        `,
          `/agreement/${newServiceAgreement.agreementNumber}`,
          ""
        );

        return newServiceAgreement;
      } catch (error) {
        console.error(
          "unable to create service agreement through mutation addServiceAgreement",
          error
        );
        throw error;
      }
    },
    signServiceAgreement: async (
      _parent,
      { agreementId, customerSignature },
      context
    ) => {
      try {
        const signedServiceAgreement = await ServiceAgreement.findById(
          agreementId
        );
        // Populate paths individually to fix an issue I can't trace
        await signedServiceAgreement.populate("customer");
        await signedServiceAgreement.populate("provider");
        await signedServiceAgreement.populate("product");
        await signedServiceAgreement.populate("customer.user");
        await signedServiceAgreement.populate("provider.user");
        await signedServiceAgreement.save();

        if (customerSignature) {
          signedServiceAgreement.approvedByCustomer = true;
          signedServiceAgreement.customerSignature = customerSignature;
        }

        const first = signedServiceAgreement.customer.user?.first;
        const last = signedServiceAgreement.customer.user?.last;
        const providerName = signedServiceAgreement.provider?.providerName;
        const product = signedServiceAgreement?.product;
        const startDate = signedServiceAgreement?.startDate;

        const renderedHtml = renderTemplate(
          signedServiceAgreement.toObject(),
          "template"
        ); // Ensure the template file name matches

        const outputPath = path.join(
          __dirname,
          `../customerData/agreements/${providerName}-${first}-${last}/ServiceAgreement-${providerName}-${first}-${last}-${dayjs(
            startDate
          ).format("DD-MM-YYYY")}-${generateRandomNumber(1, 3000000)}.pdf`
        );

        const pdfPath = await convertToPdf(renderedHtml, outputPath);

        const customerUser = await User.findById(
          signedServiceAgreement.customer.user._id
        );

        const renderedEmail = renderTemplate(
          { subject: "New Service Agreement", first, providerName, product },
          "emailTemplate"
        );
        customerUser.sendEmail(
          "A new Service Agreement has Arrived",
          ``,
          renderedEmail,
          "/",
          outputPath
        );

        signedServiceAgreement.agreementPath = pdfPath;
        await signedServiceAgreement.save();
        return pdfPath;
      } catch (error) {
        console.error(
          `Error in signServiceAgreementsigned Service Agreement: `,
          error
        );
        throw error;
      }
    },
    toggleUserRole: async (_parent, { userId, role }, context) => {
      if (!userId === (context.user.roleAdmin || context.user.superAdmin))
        throw new Error("userId didnt match with admin");
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
      console.log("update user resolver reached");
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
          await updatedUser.sendEmail(
            "Profile updated",
            `Hi ${first}, we have updated your profile`,
            `<p>Hi ${first}, we have updated your profile</p>
            <h2>firstName:</h2>
            <h3>${first}</h2>
            <h2>Last Name:</h2>
            <h3> ${last}</h2>
            <h2>mobile:</h2><h3> ${mobile}</h2>
            <h2>email:</h2><h3> ${email}</h2>            
            `,
            `/`
          );
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
