const { verifyToken } = require("./../utils/helpers");
const { EMAILService } = require("../utils/mailer");
const userEmailService = new EMAILService();
const {
  User,
  Admin,
  Provider,
  Customer,
  Product,
  ServiceAgreement,
} = require("../models");
const { addServiceAgreement } = require("./resolvers.serviceAgreement");
const { signToken } = require("../utils/auth.js");

module.exports = {
  getMe: async (_parent, { contact, pasword }, context) => {
    const { user } = context;
    const authenticatedUser = await User.findOne({
      $or: [
        { "contact.email": contact.email.toLowerCase() || null },
        { "contact.mobile": contact.mobile || null },
      ],
    });
    if (!authenticatedUser)
      throw unauthenticated("we couldn't find a user with those details");
    const authenticatedUserObject = authenticatedUser.toObject();
    const token = signToken(authenticatedUserObject);
    const response = {
      success: true,
      message: "AUTHENTICATED: Here is your user and token",
      user: authenticatedUserObject,
      token,
    };

    return response;
  }, //progessed to here. continue here:
  getAllUsers: async (_parent, {}, context) => {
    const user = await User.findById(context.user._id);
    const admin = await User.findById(context.user.roleAdmin);
    if (admin || user.roleSuperAdmin) {
      try {
        const users = await User.find({}).populate();
        return users;
      } catch (error) {
        console.log("getAllUsers resolver error", error);
        return error;
      }
    } else return { message: "user needs to be admin to perform this action" };
  },
  getAllProducts: async () => {},
  getAllProviderServices: async (_parent, { providerId }) => {},
  getAllProviderServiceAgreements: async (_parent, { providerId }) => {},
  getServiceAgreement: async (_parent, { agreementNumber }) => {},
  addUser: async (_parent, { input }) => {},
  loginUser: async (_parent, { email, password }) => {},
  addServiceAgreement: async (_parent, { input }) => {},
  signServiceAgreement: async (_parent, { input }) => {},
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
            user.roleAdmin = null;
            await user.save(); // Update user document
          } else {
            const admin =
              (await Admin.findOne({ user: user._id })) ||
              (await Admin.create({ user: user._id }));
            user.roleAdmin = admin._id;
          }
          await user.save();
          break;
        case "provider":
          if (user.roleProvider) {
            user.roleProvider = null;
            await user.save(); // Update user document
          } else {
            const provider =
              (await Provider.findOne({ user: user._id })) ||
              (await Provider.create({
                user: user._id,
              }));
            user.roleProvider = provider._id;
          }
          await user.save();
          break;
        case "customer":
          if (user.roleCustomer) {
            user.roleCustomer = null;
            await user.save();
          } else {
            const customer =
              (await Customer.findOne({ user: user._id })) ||
              (await Customer.create({
                user: user._id,
              }));
            user.roleCustomer = customer._id;
          }
          await user.save();
          break;

        default:
          throw new Error("Invalid role");
      }

      return user;
    } catch (error) {
      console.error("Error in toggleUserRole:", error);
      throw new Error("Failed to toggle user role");
    }
  },
  updateUserProfile: async (
    _parent,
    { userId, first, last, mobile, email },
  ) => {
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

        await userEmailService.sendMail(
          updatedUser.email,
          "Profile updated",
          `Hi ${first}, we have updated your profile. Have a great day :)
            `,
          `Hi ${first}, we have updated your profile`,
          `<p>Hi ${first}, we have updated your profile</p>
            <h3>firstName:</h3>
            <h4>${first}</h4>
            <h3>Last Name:</h3>
            <h4> ${last}</h4>
            <h3>mobile:</h3>
            <h4> ${mobile}</h4>
            <h3>email:</h3>
            <h4> ${email}</h4>            
            `,
        );
      }

      return updatedUser;
    } catch (error) {
      throw new Error(error.message);
    }
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
  updateProviderProfile: async (
    _parent,
    {
      userId,
      providerId,
      providerName,
      abn,
      termsAndConditions,
      address,
      logo,
    },
    context,
  ) => {
    try {
      // Find the user and ensure they have the provider role
      const user = await User.findById(userId);
      if (
        !user?.roleProvider ||
        user.roleProvider._id.toString() !== providerId
      ) {
        throw new GraphQLError(
          "User does not have permission to update this provider.",
        );
      }

      // Update provider fields if they are provided (not undefined)
      // Find the provider
      const provider = await Provider.findById(providerId);
      if (!provider) {
        throw new GraphQLError("Provider not found.");
      }

      // Prepare the update object only with the fields provided
      const updatedFields = {
        ...(providerName && { providerName }),
        ...(abn && { abn }),
        ...(termsAndConditions && { termsAndConditions }),
        ...(logo && { logoUrl: logo }), // Store the logo as Base64 or URL
        address: {
          ...provider.address,
          ...address, // Merge new address fields with existing ones
        },
      };

      // Update the provider with new fields
      Object.assign(provider, updatedFields);

      // Optional: Filter out services with missing product names
      provider.services = provider.services?.filter(
        (service) => !!service.product?.name,
      );

      // Save the updated provider
      const updatedProvider = await provider.save();
      return updatedProvider;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update provider profile");
    }
  },
  addNewCustomerToProvider: async (
    _parent,
    {
      token,
      providerId,
      first,
      last,
      mobile,
      email,
      invoiceEmail,
      referenceNumber,
      referenceName,
      dateOfBirth,
    },
    context,
  ) => {
    try {
      if (!verifyToken(token))
        throw new Error("Could not verify with that token");
      let user = await User.findOneAndUpdate(
        { first, last, dateOfBirth },
        { email },
      );
      if (!user) {
        user = await User.create({ first, last, mobile, email });
      }
      if (!user) {
        throw new Error("Could not add or find user in addCustomer resolver");
      }

      // Step 3: Check if the customer exists or create a new customer
      let customer = await Customer.findById(user.roleCustomer);
      if (!customer) {
        customer = await Customer.create({
          user: user._id,
          invoiceEmail,
          referenceName,
          referenceNumber,
          dateOfBirth,
        });
        // Link the newly created customer to the user
        if (!customer)
          throw new Error("Could not add customer in addCustomer resolver");
        user.roleCustomer = customer._id;
        await user.save();
      } else {
        // Update existing customer with the provided details
        await Customer.findByIdAndUpdate(
          customer._id,
          {
            invoiceEmail,
            referenceName,
            referenceNumber,
            dateOfBirth,
          },
          { new: true },
        );
      }

      // Step 4: Link the customer to the provider
      const provider = await Provider.findById(providerId);
      if (provider) {
        await provider.updateOne({
          $addToSet: { linkedCustomers: customer._id },
        });
      }
      await provider.save();
      return provider.toObject();
    } catch (error) {
      console.error("Error in addCustomer resolver:", error.message);
      throw error;
    }
  },
  addServiceToProvider: async (_parent, { providerId, productId }, context) => {
    try {
      // Find the provider and product by their IDs
      const provider = await Provider.findById(providerId);
      const product = await Product.findById(productId);

      if (!provider) throw new Error(`${providerId} not found`);
      if (!product) throw new Error(`${productId} not found`);

      // Create the new service
      const addedService = await Service.create({
        provider: providerId,
        product: productId,
        price: product.price,
      });
      if (!addedService) throw new Error(`we couldnt create a service`);

      provider.services.push(addedService._id);
      await provider.save();

      // Populate the service with the provider and product data
      await addedService.populate("provider product");

      return {
        success: true,
        message: "Service successfully created",
        service: addedService,
      };
    } catch (error) {
      if (error.code === 11000) {
        return {
          success: false,
          message:
            "A provider can only have one service of the same product name",
        };
      }
      console.log(error);
      return {
        success: false,
        message: "An error occurred while creating the service",
      };
    }
  },
  deleteServiceFromProvider: async (
    _parent,
    { providerId, serviceId },
    context,
  ) => {},
};
