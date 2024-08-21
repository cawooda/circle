const { User } = require("../models");
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
};
