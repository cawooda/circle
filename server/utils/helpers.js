const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

function generateRandom10DigitNumber() {
  const min = 1000000000; // Smallest 10-digit number
  const max = 9999999999; // Largest 10-digit number
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}

module.exports = { validateEmail, generateRandom10DigitNumber };
