const { User } = require("../models/");
const { GraphQLError } = require("graphql");
const { verifyToken } = require("./tokenHandler");

const unauthenticated = (message = "Not authenticated") =>
  new GraphQLError(message, { extensions: { code: "UNAUTHENTICATED" } });
const unauthorized = (message = "Not authorized") =>
  new GraphQLError(message, { extensions: { code: "UNAUTHOURISED" } });

//places a payload into a token returning the token

async function authMiddleware({ req }) {
  try {
    let headers = req?.headers;
    console.log(req.body?.operationName);
    let token = headers?.authorization?.split(" ").pop().trim() || null;
    if (!token) throw new Error("no token");
    let decoded = await verifyToken(token);
    console.log("decoided", decoded);
    let { sub, role } = decoded;
    if (sub && role) {
      console.log("sub", sub);
      console.log("role", role);
      user = await User.findOne({ _id: sub });
    } else {
      (user = null), (role = "LOGIN");
    }
    return { user, role };
  } catch (error) {
    console.log(error);
    console.log({ user: null, role: "LOGIN" });
    return { user: null, role: "LOGIN" };
  }
}

module.exports = {
  verifyToken,
  authMiddleware,
};
