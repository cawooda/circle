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
module.exports = {
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
  getMe: async (_parent, { token }, context) => {
    try {
      if (!context.user) {
        console.log(token);
        const authenticatedPerson = await verifyToken(token);
        if (!authenticatedPerson)
          throw new Error("Could not verify with that token");
        const user = authenticatedPerson;
        context = { user };
      }

      const user = await User.findById(context.user._id)
        .populate("roleCustomer")
        .populate("roleProvider")
        .populate({
          path: "roleProvider",
          populate: [
            {
              path: "user",
              model: "user",
            },
            {
              path: "services",
              model: "service",
              populate: { path: "product", model: "product" },
            },
            {
              path: "shifts",
              model: "shift",
              populate: { path: "service", model: "service" },
            },
            {
              path: "linkedCustomers",
              model: "customer",
              populate: { path: "user", model: "user" },
            },
            {
              path: "serviceAgreements",
              model: "agreement",
            },
            {
              path: "termsAndConditions",
            },
            {
              path: "services",
              model: "service",
              populate: {
                path: "product",
                model: "product",
              },
            },
            {
              path: "linkedCustomers",
              model: "customer",
              populate: {
                path: "user",
                model: "user",
              },
            },
          ],
        })
        .populate("roleAdmin")
        .exec();

      if (user.roleProvider) {
        user.roleProvider.linkedCustomers =
          user.roleProvider?.linkedCustomers.filter((customer) => {
            if (customer.user.mobile && customer.user.first) {
              return true;
            } else
              console.log(`${customer._id} dint have a mobile or first name`);
          });
      }
      if (user.roleProvider) {
        user.roleProvider.services = user.roleProvider?.services.filter(
          (service) => {
            if (service.product.name) {
              return true;
            }
          }
        );
      }

      user.save();
      // for each linked customer in the roleProvider of user, check whether the population has worked to give name, mobile etc.
      // if not delete the id from the linked

      if (user) {
        const serviceAgreements = await ServiceAgreement.find({
          $or: [
            { provider: user.roleProvider },
            { customer: user.roleCustomer },
          ],
        })
          .populate({
            path: "provider",
            model: "provider",
            populate: { path: "user", model: "user" },
          })
          .populate({
            path: "customer",
            model: "customer",
            populate: { path: "user", model: "user" },
          })
          .populate({
            path: "service",
            model: "service",
            populate: { path: "product", model: "product" },
          })
          .lean({ virtuals: true })
          .exec();

        user.serviceAgreements = serviceAgreements;

        return user;
      } else {
        return { message: "user not found" };
      }
    } catch (error) {
      console.log("user resolver error getMe", error);
    }
  },
  getUserByToken: async (_parent, { token }, context) => {
    try {
      const authenticatedPerson = await verifyToken(token);

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

        await userEmailService.sendEmail(
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
            `
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
