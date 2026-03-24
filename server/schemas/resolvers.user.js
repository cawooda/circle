const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { EMAILService } = require("../utils/mailer");
const serviceActor = { sub: "RESOLVER", role: "SERVICE" };
// const userEmailService = new EMAILService();
// const { User, Admin, Provider, Customer, Product } = require("../models");
const {
  loginUser,
  resetUserPassword,
  addNewUser,
  updateUserPassword,
} = require("../services/auth.service");

const { getUser, updateUserProfile } = require("../services/user.service");

const { GraphQLError } = require("graphql");

// const {
//   signToken,
//   verifyToken,
//   checkPassword,
//   generateAuthCode,
//   hashPassword,
// } = require("../utils/auth");
//context always contains { user, role } but these can be null. resolvers should always check role
module.exports = {
  getMe: async (_parent, _data, context) => {
    if (!context?.user)
      throw new GraphQLError(
        "UNAUTHENTICATED:Tried to do something without an authenticated user. Try logging in before anything else",
        {
          extensions: { code: "FORBIDDEN" },
        },
      );
    const user = await getUser({
      actor: context.user,
      payload: { userId: context.user._id },
    });

    const response = {
      success: user && true,
      message: "success,heres your user details",
      user,
    };
    return response;
  },

  addUser: async (_parent, { input }, context) => {
    const { mobile, email } = input;
    if (!mobile && !email)
      throw new GraphQLError(
        "BAD_INPUT: we need the right contact details to add user",
      );
    const user = await addNewUser({
      actor: serviceActor,
      payload: input,
    });

    return {
      success: user && true,
      message: "SUCCESS: we created a user",
      user,
    };
  },
  passwordReset: async (_parent, { contact }, context) => {
    const success =
      (await resetUserPassword({
        actor: context,
        payload: { contact },
      })) || false;
    const response = {
      success,
      message: "Password reset initiated",
    };
    return response;
  },
  updatePassword: async (_parent, { update }, context) => {
    const { authCode, newPassword } = update;
    const updatedUserPassword = await updateUserPassword({
      actor: null,
      payload: { authCode, newPassword },
    });
    const response = {
      success: updatedUserPassword,
      message: "we successfully changed your password",
    };

    return response;
  },
  login: async (_parent, { contact, password }, context) => {
    //contact information is used as the actor in a login scenario
    if (!password) throw new Error("we need a password for that");
    if (!contact) throw new Error("we need a contact for that");
    const token = loginUser({ actor: { contact }, payload: { password } });
    const response = {
      success: token ? true : false,
      message: "user successfully logged in, heres your token",
      token,
    };
    return response;
  },
  logout: async (_parent, _data, context) => {
    const { sub } = context;
    const result = await logoutUser({ actor: sub, payload: sub });
    const response = {
      success: result,
      message: result
        ? "we successfully logged you out"
        : "sorry we couldnt log you out",
    };
    return response;
  },
  updateUserProfile: async (_parent, data, context) => {
    const { sub } = context;
    const updateUser = updateUserProfile({ actor: sub, payload: data });
    if (!updatedUser) return updatedUser;
  },
  // addServiceAgreement: async (_parent, { input }) => {},
  // signServiceAgreement: async (_parent, { input }) => {},
  // toggleUserRole: async (_parent, { userId, role }, context) => {
  //   if (!userId === (context.user.roleAdmin || context.user.superAdmin))
  //     throw new Error("userId didnt match with admin");
  //   try {
  //     const user = await User.findById(userId);
  //     if (!user) {
  //       throw new Error("User not found");
  //     }
  //     switch (role) {
  //       case "admin":
  //         if (user.roleAdmin) {
  //           user.roleAdmin = null;
  //           await user.save(); // Update user document
  //         } else {
  //           const admin =
  //             (await Admin.findOne({ user: user._id })) ||
  //             (await Admin.create({ user: user._id }));
  //           user.roleAdmin = admin._id;
  //         }
  //         await user.save();
  //         break;
  //       case "provider":
  //         if (user.roleProvider) {
  //           user.roleProvider = null;
  //           await user.save(); // Update user document
  //         } else {
  //           const provider =
  //             (await Provider.findOne({ user: user._id })) ||
  //             (await Provider.create({
  //               user: user._id,
  //             }));
  //           user.roleProvider = provider._id;
  //         }
  //         await user.save();
  //         break;
  //       case "customer":
  //         if (user.roleCustomer) {
  //           user.roleCustomer = null;
  //           await user.save();
  //         } else {
  //           const customer =
  //             (await Customer.findOne({ user: user._id })) ||
  //             (await Customer.create({
  //               user: user._id,
  //             }));
  //           user.roleCustomer = customer._id;
  //         }
  //         await user.save();
  //         break;

  //       default:
  //         throw new Error("Invalid role");
  //     }

  //     return user;
  //   } catch (error) {
  //     console.error("Error in toggleUserRole:", error);
  //     throw new Error("Failed to toggle user role");
  //   }
  // },

  // updateProviderProfile: async (
  //   _parent,
  //   {
  //     userId,
  //     providerId,
  //     providerName,
  //     abn,
  //     termsAndConditions,
  //     address,
  //     logo,
  //   },
  //   context,
  // ) => {
  //   try {
  //     // Find the user and ensure they have the provider role
  //     const user = await User.findById(userId);
  //     if (
  //       !user?.roleProvider ||
  //       user.roleProvider._id.toString() !== providerId
  //     ) {
  //       throw new GraphQLError(
  //         "User does not have permission to update this provider.",
  //       );
  //     }

  //     // Update provider fields if they are provided (not undefined)
  //     // Find the provider
  //     const provider = await Provider.findById(providerId);
  //     if (!provider) {
  //       throw new GraphQLError("Provider not found.");
  //     }

  //     // Prepare the update object only with the fields provided
  //     const updatedFields = {
  //       ...(providerName && { providerName }),
  //       ...(abn && { abn }),
  //       ...(termsAndConditions && { termsAndConditions }),
  //       ...(logo && { logoUrl: logo }), // Store the logo as Base64 or URL
  //       address: {
  //         ...provider.address,
  //         ...address, // Merge new address fields with existing ones
  //       },
  //     };

  //     // Update the provider with new fields
  //     Object.assign(provider, updatedFields);

  //     // Optional: Filter out services with missing product names
  //     provider.services = provider.services?.filter(
  //       (service) => !!service.product?.name,
  //     );

  //     // Save the updated provider
  //     const updatedProvider = await provider.save();
  //     return updatedProvider;
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error("Failed to update provider profile");
  //   }
  // },
  // addNewCustomerToProvider: async (
  //   _parent,
  //   {
  //     token,
  //     providerId,
  //     first,
  //     last,
  //     mobile,
  //     email,
  //     invoiceEmail,
  //     referenceNumber,
  //     referenceName,
  //     dateOfBirth,
  //   },
  //   context,
  // ) => {
  //   try {
  //     if (!verifyToken(token))
  //       throw new Error("Could not verify with that token");
  //     let user = await User.findOneAndUpdate(
  //       { first, last, dateOfBirth },
  //       { email },
  //     );
  //     if (!user) {
  //       user = await User.create({ first, last, mobile, email });
  //     }
  //     if (!user) {
  //       throw new Error("Could not add or find user in addCustomer resolver");
  //     }

  //     // Step 3: Check if the customer exists or create a new customer
  //     let customer = await Customer.findById(user.roleCustomer);
  //     if (!customer) {
  //       customer = await Customer.create({
  //         user: user._id,
  //         invoiceEmail,
  //         referenceName,
  //         referenceNumber,
  //         dateOfBirth,
  //       });
  //       // Link the newly created customer to the user
  //       if (!customer)
  //         throw new Error("Could not add customer in addCustomer resolver");
  //       user.roleCustomer = customer._id;
  //       await user.save();
  //     } else {
  //       // Update existing customer with the provided details
  //       await Customer.findByIdAndUpdate(
  //         customer._id,
  //         {
  //           invoiceEmail,
  //           referenceName,
  //           referenceNumber,
  //           dateOfBirth,
  //         },
  //         { new: true },
  //       );
  //     }

  //     // Step 4: Link the customer to the provider
  //     const provider = await Provider.findById(providerId);
  //     if (provider) {
  //       await provider.updateOne({
  //         $addToSet: { linkedCustomers: customer._id },
  //       });
  //     }
  //     await provider.save();
  //     return provider.toObject();
  //   } catch (error) {
  //     console.error("Error in addCustomer resolver:", error.message);
  //     throw error;
  //   }
  // },
  // addServiceToProvider: async (_parent, { providerId, productId }, context) => {
  //   try {
  //     // Find the provider and product by their IDs
  //     const provider = await Provider.findById(providerId);
  //     const product = await Product.findById(productId);

  //     if (!provider) throw new Error(`${providerId} not found`);
  //     if (!product) throw new Error(`${productId} not found`);

  //     // Create the new service
  //     const addedService = await Service.create({
  //       provider: providerId,
  //       product: productId,
  //       price: product.price,
  //     });
  //     if (!addedService) throw new Error(`we couldnt create a service`);

  //     provider.services.push(addedService._id);
  //     await provider.save();

  //     // Populate the service with the provider and product data
  //     await addedService.populate("provider product");

  //     return {
  //       success: true,
  //       message: "Service successfully created",
  //       service: addedService,
  //     };
  //   } catch (error) {
  //     if (error.code === 11000) {
  //       return {
  //         success: false,
  //         message:
  //           "A provider can only have one service of the same product name",
  //       };
  //     }
  //     console.log(error);
  //     return {
  //       success: false,
  //       message: "An error occurred while creating the service",
  //     };
  //   }
  // },
  // deleteServiceFromProvider: async (
  //   _parent,
  //   { providerId, serviceId },
  //   context,
  // ) => {},
};
