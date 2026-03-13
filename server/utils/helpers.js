require("dotenv").config();

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

function generateRandomNumber(min = 1000000000, max = 9999999999) {
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  return randomNumber;
}

function generateRandomPhoneNumber() {
  const min = 100000000;
  const max = 999999999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  const stringedNumber = `0${randomNumber.toString()}`;
  return stringedNumber;
}

module.exports = {
  validateEmail,
  generateRandomNumber,
  generateRandomPhoneNumber,
};
