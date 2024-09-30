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

export const validatePasswordInput = (password) => {
  return password.length >= 8;
};
