require("dotenv").config();
const secret = process.env.SECRET_KEY;
const { User } = require("../models/");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

// function for our authenticated routes
module.exports = {
  AuthenticationError: new GraphQLError("Could not authenticate user.", {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  }),

  // token-based authentication scheme.
  authMiddleware: async function ({ req, res, next }) {
    if (req.body.operationName == "addUser") return res;
    let token = req.body.token || req.query.token || req.headers.authorization;
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }
    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    // verify token and get user data out of it
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
        req.user = authenticatedPerson;
      }
      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        res.status(401).json({ error: "Token expired" });
      } else {
        console.error("Authentication Error:", error);
        res.status(401).json({ error: "Authentication failed" });
      }
    }
  },

  signToken: function (payload) {
    return jwt.sign(payload, secret, {
      expiresIn: process.env.TOKEN_EXPIRES_IN,
    });
  },
};
