const { User, Admin } = require("../models");
const { roles } = require("../utils/roles");
const jwt = require("jsonwebtoken");

const resolvers = {
  Query: {
    getAllUsers: async () => {
      try {
        const users = await User.find({}).populate();

        return users;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    getUserById: async (_parent, { id }) => {
      console.log(id);
      const user = await User.findById(id).populate();
      console.log(user);
      return user;
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
        console.log(user);
      } catch (error) {}
    },
  },
};

module.exports = resolvers;
