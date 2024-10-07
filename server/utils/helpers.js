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

function verifyToken(token) {
  try {
    const { authenticatedPerson } = jwt.verify(token, process.env.SECRET_KEY);
    return authenticatedPerson;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("Token has expired. Please log in again.");
    } else if (error.name === "JsonWebTokenError") {
      console.log("Invalid token. Please provide a valid token.");
    } else if (error.name === "NotBeforeError") {
      console.log("Token is not active yet.");
    } else {
      console.log("An unknown error occurred.");
    }
    console.error(error.message);
  }
}

module.exports = { validateEmail, verifyToken, generateRandomNumber };
