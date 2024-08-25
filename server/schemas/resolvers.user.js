const {
  User,
  Admin,
  Provider,
  Customer,
  Product,
  ServiceAgreement,
} = require("../models");
module.exports = {
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
    } else return { message: "user needs to be admin to perform this action" };
  },
  getMe: async (_parent, {}, context) => {
    const user = await User.findById(context.user._id)
      .populate("roleCustomer")
      .populate("roleProvider")
      .populate("roleAdmin");

    if (user) {
      const serviceAgreements = await ServiceAgreement.find({
        $or: [{ provider: user.roleProvider }, { customer: user.roleCustomer }],
      })
        .populate({
          path: "provider",
          populate: { path: "user" },
        })
        .populate({
          path: "customer",
          populate: { path: "user" },
        })
        .populate("product")
        .lean({ virtuals: true });

      // Manually set fullName for customer and provider
      serviceAgreements.forEach((agreement) => {
        if (agreement.provider && agreement.provider.user) {
          agreement.provider.user.fullName = `${agreement.provider.user.first} ${agreement.provider.user.last}`;
        }
        if (agreement.customer && agreement.customer.user) {
          agreement.customer.user.fullName = `${agreement.customer.user.first} ${agreement.customer.user.last}`;
        }
      });

      user.serviceAgreements = serviceAgreements;

      console.log(user.serviceAgreements[1]); // Ensure fullName is correct here

      return user;
    } else {
      return { message: "user not found" };
    }
  },
  getUserByToken: async (_parent, { token }, context) => {
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
  getUserRoles: async (_parent, { id }, context) => {
    const user = await User.findById(id);
  },
  getCustomers: async (_parent, {}, context) => {
    //check what users the context user can get.

    try {
      const customers = await Customer.find({}).populate("user");

      return customers;
    } catch (error) {
      console.error(error);
    }
  },
  getProducts: async (_parent, {}, context) => {
    try {
      const productList = Product.find({});

      return productList;
    } catch (error) {
      console.error(error);
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
                ndisNumber: require("../utils/helpers").generateRandomNumber(
                  1000000000,
                  9999999999
                ),
                address: "1 Street Name, Town, PostCode",
                dateOfBirth: new Date(1990, 0, 1), // Example date of birth
                customerSpecificField: "Specific details about the customer",
              }));
            user.roleCustomer = customer._id;
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
};
