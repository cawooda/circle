const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

function generateRandomNumber(min = 1000000000, max = 9999999999) {
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log("random number:", randomNumber);
  return randomNumber;
}

module.exports = { validateEmail, generateRandomNumber };
