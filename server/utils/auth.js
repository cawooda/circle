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

async function authMiddleware({ req, res }) {
  try {
    let user;
    if (req.body?.operationName == "IntrospectionQuery") {
      return { user: null, role: "INTROSPECTION" };
    }
    if (req.body?.operationName == "PasswordReset") {
      return { user: null, role: "PASSWORDRESET" };
    }
    const token = req?.headers?.authorization?.split(" ").pop().trim() || null;
    if (!token) throw new Error("no token");
    const decoded = await verifyToken(token);
    if (typeof decoded == { sub: String, role: String }) {
      throw new Error("token not decoded");
    }

    const { sub, role } = decoded;
    if (sub && role) {
      const user = await User.findOne({ _id: sub });
      return { user, role };
    } else {
      //could not decode sub and role from token so proceed to login
      (user = null), (role = "LOGIN");
      return { user, role };
    }
  } catch (error) {
    console.log(error);
    //could not authourise the user proceed to login stage
    return { user: null, role: "LOGIN" };
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
  } else
    throw new Error(
      "PASSWORD_FAIL:we compared the password with the hash and it didnt compare well",
    );
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
