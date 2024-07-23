const { User, Admin } = require("../models");
const { roles } = require("../utils/roles");
const jwt = require("jsonwebtoken");

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
    getUserByToken: async (_parent, { token }) => {
      const { authenticatedPerson } = await jwt.verify(
        token,
        process.env.SECRET_KEY,
        {
          maxAge: process.env.TOKEN_EXPIRES_IN,
        }
      );
      return await User.findById(authenticatedPerson._id);
    },
    getUserRoles: async (_parent, { id }) => {
      const user = await User.findById(id);
    },
  },
  Mutation: {
    addUser: async (_parent, { first, last, mobile, email, password }) => {
      try {
        const newUser = await User.create({
          first,
          last,
          mobile,
          email,
          password,
        });
        return newUser;
      } catch (error) {
        console.log(error);
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
