export const isWithinRange = (input, atLeast, atMost) => {
  if (input.length >= atLeast) return input.length <= atMost;
};

export const isNumber = (input) => {
  return /^\d+$/.test(input);
};

export const validateMobileInput = (mobile) => {
  const cleanedMobile = mobile.replace(/\D/g, "");
  return cleanedMobile.length === 10;
};

export const validateMobileNumber = (mobile) => {
  const mobileRegex = /^\d{10}$/; // Regular expression to match exactly 10 digits
  return mobileRegex.test(mobile); // Returns true if the input matches the regex
};

export const validateEmailInput = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Simple email regex

export const validatePasswordInput = (password) => {
  return password.length >= 8;
};
