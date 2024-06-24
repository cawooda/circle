function validateEmail(input) {
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  //defines the regex for used in validation
  return validRegex.test(input) ? true : false;
}

module.exports = { validateEmail };
