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
    const {authenticatedPerson} = jwt.verify(token, process.env.SECRET_KEY);
    return authenticatedPerson;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired, please log in again.');
    }
    throw new Error('An error occurred in verifyToken');
  }
}

module.exports = { validateEmail, verifyToken, generateRandomNumber };
