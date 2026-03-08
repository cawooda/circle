require("dotenv").config();

// const secret = process.env.SECRET_KEY;
const secret = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");

const signToken = (
  payload,
  expiresIn = process.env.TOKEN_EXPIRES_IN,
  AUDIENCE = "CIRCLE_AUTH",
  ISSUER = "CIRCLE_AUTH",
) => {
  if (typeof payload !== "object")
    throw new Error("TYPEMISMATCH: we dont accept non objects as payloads");
  if (expiresIn == null || expiresIn === "")
    throw new Error(
      "TOKEN_EXPIRY_MISSING: TOKEN_EXPIRES_IN must be set or provided",
    );
  try {
    const token = jwt.sign(payload, secret, {
      issuer: ISSUER,
      audience: AUDIENCE,
      expiresIn,
    });
    return token;
  } catch (error) {
    throw error;
  }
};

//extracts the payload from a token ensuring the audience and issuer are consistent with Auth
const verifyToken = async (
  token,
  AUDIENCE = "CIRCLE_AUTH",
  ISSUER = "CIRCLE_AUTH",
) => {
  if (!token) return { error: "NO_TOKEN:No Token Provided" };
  try {
    const payload = jwt.verify(token, secret, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    console.log(payload);
    return payload;
  } catch (error) {
    console.log("error verifyToken", error);
    return null;
  }
};

module.exports = { signToken, verifyToken };
