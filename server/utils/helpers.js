require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

function generateRandomNumber(min = 1000000000, max = 9999999999) {
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  return randomNumber;
}

async function verifyToken(token) {
  try {
    const { authenticatedPerson } = await jwt.verify(token, secret, {
      maxAge: process.env.TOKEN_EXPIRES_IN,
    });
    if (!authenticatedPerson)
      throw new Error("we couldn't authenticate with that token.");
    return authenticatedPerson;
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = { validateEmail, verifyToken, generateRandomNumber };
