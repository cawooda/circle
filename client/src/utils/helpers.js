export const validateMobileInput = (mobile) => {
  const cleanedMobile = mobile.replace(/\D/g, "");
  return cleanedMobile.length === 10;
};
