require("dotenv").config();
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

  //token based authentication scheme.
  authMiddleware: async function ({ req, res, next }) {
    // allows token to be sent via  req.query or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      //   res.end("not token");
    }

    // verify token and get user data out of it
    try {
      const { authenticatedPerson } = await jwt.verify(
        token,
        process.env.SECRET_KEY,
        {
          maxAge: process.env.TOKEN_EXPIRES_IN,
        }
      );
      registeredUser = await User.findById(authenticatedPerson._id);
      if (!registeredUser) throw new error("no user found");
      if (registeredUser._id == registeredUser._id)
        req.user = authenticatedPerson;
      return res;
    } catch (error) {
      console.log("Error", error);
      res.end(error);
    }
  },
  signToken: function (payload) {
    return jwt.sign(payload, secret, {
      expiresIn: process.env.TOKEN_EXPIRES_IN,
    });
  },
};
