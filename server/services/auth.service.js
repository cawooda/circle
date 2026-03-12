const {
  signToken,
  verifyToken,
  checkPassword,
  generateAuthCode,
  hashPassword,
} = require("../utils/auth");

const { User } = require("../models");

module.exports = {
  loginUser: async ({ actor, payload }) => {
    //contact information is used as the actor in login
    try {
      const { contact } = actor;
      const { email, mobile } = contact;
      const { password } = payload;
      const foundUser = await User.findOne({
        $or: [
          { "contact.email": email?.toLowerCase() || null },
          { "contact.mobile": mobile || null },
        ],
      });
      if (!foundUser.passwordHash)
        throw new Error("password must be set before login");
      if (await !checkPassword(password, foundUser.passwordHash))
        throw new Error("we couldnt log in with that password");

      const token = signToken({
        sub: foundUser._id,
        role: foundUser.admin
          ? "ADMIN"
          : foundUser.provider
          ? "PROVIDER"
          : foundUser.customer
          ? "CUSTOMER"
          : "NONE",
      });
      return token;
    } catch (error) {
      console.log("error iin loginUser in auth.service.js");
      return null;
    }
  },
};
