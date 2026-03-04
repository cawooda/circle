require("dotenv").config();
const secret = process.env.SECRET_KEY;
const { User } = require("../models/");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const { openOperations } = require("./auth.config");

const unauthenticated = (message = "Not authenticated") =>
  new GraphQLError(message, { extensions: { code: "UNAUTHENTICATED" } });
const unauthorized = (message = "Not authorized") =>
  new GraphQLError(message, { extensions: { code: "UNAUTHOURISED" } });

async function authMiddleware({ req }) {
  //Happy route sends a user object with fields.
  // failuer leads to a user object with a null token.
  // null token users can only proceed with certain operations.
  // for all other operations, they fail.
  // With a well formed token matching an existing user, the user is passed through the context
  // Parse the request body to get the operation name
  const operationName = req.body.operationName || null;
  // Check if the current request matches any open operation names and quickly fail if they do not have authorisation token
  if (!operationName || openOperations.includes(operationName)) {
    console.log(
      "user with null token provided to context for operations requiring no authorization eg new user.",
    );
    return { user: { token: null } };
  }
  if (!req.headers.authorization) {
    throw unauthorized("could not find the right authorization");
  }
  //extract the token or make it null. quickly fail if no token.
  let token = req.headers.authorization.split(" ").pop().trim() || null;
  if (!token) throw unauthorized("could not find the right token");

  try {
    const { authenticatedPerson } = await jwt.verify(token, secret, {
      maxAge: process.env.TOKEN_EXPIRES_IN,
    });
    const registeredUser = await User.findById(authenticatedPerson?._id);
    if (!registeredUser) {
      throw unauthenticated("Could not find a registered user with that token");
    }
    if (registeredUser._id == authenticatedPerson._id) {
      await registeredUser.toObject();
      return { user: registeredUser };
    } else {
      throw unauthenticated("Authentication failed. thats all we know");
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw unauthenticated("Token Expired, sorry");
    } else {
      throw unauthenticated("Authentication failed. Thats all we know");
    }
  }
}

module.exports = {
  authMiddleware,
};
