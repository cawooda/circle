const { User, Admin } = require("../models");
const { roles } = require("../utils/roles");

const resolvers = {
  Query: {
    getAllUsers: async () => {
      try {
        const user = await User.find().populate();
        console.log(user);
        return user;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    getUserById: async (_parent, { id }) => {
      return await User.findById(id);
    },
    getUserRoles: async (_parent, { id }) => {
      const user = await User.findById(id);
    },
  },
  Mutation: {
    toggleUserRole: async (_parent, { userId, role }) => {
      const user = await User.findById(userId);
      try {
        switch (role) {
          case "ADMIN":
            user.isAdmin = !user.isAdmin;
            break;
          case "CUSTOMER":
            user.isCustomer = !user.isCustomer;
            break;
          case "PROVIDER":
            user.isProvider = !user.isProvider;
            break;
          default:
            break;
        }
      } catch (error) {}
    },
  },
};

module.exports = resolvers;
