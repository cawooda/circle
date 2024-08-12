require("dotenv").config();
const secret = process.env.SECRET_KEY;
const { User } = require("../models/");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

module.exports = {
  AuthenticationError: new GraphQLError("Could not authenticate user.", {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  }),

  authMiddleware: async function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }
    if (!token) {
      throw new GraphQLError("No token provided", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    try {
      const { authenticatedPerson } = await jwt.verify(token, secret, {
        maxAge: process.env.TOKEN_EXPIRES_IN,
      });

      const registeredUser = await User.findById(authenticatedPerson._id);

      if (!registeredUser) {
        throw new GraphQLError("No user found", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      if (registeredUser._id == authenticatedPerson._id) {
        await registeredUser.populate("roleCustomer");
        await registeredUser.populate("roleAdmin");
        await registeredUser.populate("roleProvider");
        await registeredUser.toObject();
        return { user: registeredUser };
      }
      throw new GraphQLError("Authentication failed", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        console.error("Token expired error:", error);
        throw new GraphQLError("Token expired", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      } else {
        console.error("Authentication Error:", error);
        throw new GraphQLError("Authentication failed", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
    }
  },

  signToken: function (payload) {
    return jwt.sign(payload, secret, {
      expiresIn: process.env.TOKEN_EXPIRES_IN,
    });
  },
};
