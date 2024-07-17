const { User, Admin } = require("../models");

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
    getAdminByUserId: async (_parent, { userId }) => {
      return await Admin.findOne({ user: userId }).populate("user");
    },
  },
  Mutation: {},
};

module.exports = resolvers;
