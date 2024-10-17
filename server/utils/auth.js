require("dotenv").config();
const secret = process.env.SECRET_KEY;
const { User } = require("../models/");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const AuthenticationError = new GraphQLError("Could not authenticate user.", {
  extensions: {
    code: "UNAUTHENTICATED",
  },
});

async function authMiddleware({ req }) {
  // List of operation names that do not require authentication
  const openOperations = [
    "getServiceAgreement",
    "signServiceAgreement",
    "GetMe",
    "IntrospectionQuery", // Example operation name
  ];

  // Parse the request body to get the operation name
  const operationName = req.body.operationName;

  // Check if the current request matches any open operation names
  if (openOperations.includes(operationName)) {
    console.log("should retrun null for use as operationName matched");
    return { user: null };
  }

  let token = req.headers.authorization.split(" ").pop().trim();
  console.log(token);
  if (!token) {
    throw new GraphQLError("No token provided", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  try {
    const { authenticatedPerson } = await jwt.verify(token, secret, {
      maxAge: process.env.TOKEN_EXPIRES_IN,
    });

    const registeredUser = await User.findById(authenticatedPerson?._id);

    if (!registeredUser) {
      throw new GraphQLError("No user found", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    if (registeredUser._id == authenticatedPerson._id) {
      await registeredUser.populate({
        path: "roleCustomer",
        model: "customer",
      });
      await registeredUser.populate("roleAdmin");
      await registeredUser.populate("roleProvider");
      await registeredUser.toObject();
      return { user: registeredUser };
    } else {
      throw new GraphQLError("Authentication failed", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }
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
}

module.exports = {
  AuthenticationError,
  authMiddleware,
};
