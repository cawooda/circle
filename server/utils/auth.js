require("dotenv").config();

const { User } = require("../models/");
const { GraphQLError } = require("graphql");
const { signToken, verifyToken } = require("./tokenHandler");
const bcrypt = require("bcrypt");
const { generateRandomNumber } = require("./helpers");

const unauthenticated = (message = "Not authenticated") =>
  new GraphQLError(message, { extensions: { code: "UNAUTHENTICATED" } });
const unauthorized = (message = "Not authorized") =>
  new GraphQLError(message, { extensions: { code: "UNAUTHOURISED" } });

//places a payload into a token returning the token

async function authMiddleware({ req }) {
  try {
    if (req.body?.operationName == "IntrospectionQuery") {
      return { user: null, role: "INTROSPECTION" };
    }
    const authHeader = req?.headers?.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;

    if (!token) {
      return { user: null, role: null };
    }

    const decoded = await verifyToken(token, "CIRCLE_AUTH", "CIRCLE_AUTH");
    if (decoded?.error) {
      return { user: null, role: null };
    }

    const { sub, role } = decoded;

    if (sub && role) {
      const user = await User.findOne({ _id: sub });

      return { user, role };
    } else {
      throw new Error("we couldnt get the right info from the token", {
        cause: "sub or role not present",
      });
    }
  } catch (error) {
    console.log(error);
    if (error?.name === "TokenExpiredError") {
      throw unauthenticated("Session expired. Please sign in again.");
    }
    if (error?.name === "NotBeforeError") {
      throw unauthenticated("Token not active yet.");
    }
    if (error?.name === "JsonWebTokenError") {
      throw unauthenticated("Invalid authentication token.");
    }

    // Unknown/unexpected auth failure
    throw unauthenticated("Authentication failed.");
  }
}

async function hashPassword(password) {
  if (password?.length < 10 || !password) {
    throw new Error("Password must exist and be at least 10 characters.");
  }
  const hash = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_WORK_FACTOR),
  );

  return hash;
}

async function checkPassword(password, hash) {
  if (await bcrypt.compare(password, hash)) {
    return true;
  } else return false;
}

function generateAuthCode() {
  let simpleNumber = generateRandomNumber(1000, 9999).toString();
  let simpleNumberArray = simpleNumber.split("");

  const authCode = simpleNumberArray
    .map((digit, index) => {
      // Convert the string 'digit' to a number and generate lowercase letters.
      if (index % 2 === 1) {
        return String.fromCharCode(65 + parseInt(digit)).toLowerCase(); // 'a' = 97, 'A' = 65
      } else {
        return digit; // Keep original digit for even indices
      }
    })
    .join(""); // Join without commas

  return authCode;
}

module.exports = {
  signToken,
  checkPassword,
  hashPassword,
  generateAuthCode,
  verifyToken,
  authMiddleware,
};
