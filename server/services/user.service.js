const { User } = require("../models");
const { generateAuthCode, hashPassword } = require("../utils/auth");

module.exports = {
  getUser: async ({ actor, payload }) => {
    try {
      const { userId } = payload;
      const foundUser = User.findById(userId);
      return foundUser;
    } catch (error) {
      console.log("error in getUser from user.service.js", error);
    }
  },
  addUser: async ({ actor, payload }) => {},
  resetUserPassword: async ({ actor, payload }) => {
    try {
      const { user } = actor || {};
      const { contact } = payload || {};
      if (!contact) throw new Error("contact is required");

      const { email, mobile } = contact;
      const foundUser = await User.findOne({
        $or: [
          { "contact.email": email?.toLowerCase() || null },
          { "contact.mobile": mobile || null },
        ],
      });
      if (!foundUser)
        throw new Error(
          "we couldnt find a user in resetUserPassword in user.service.js",
        );
      const isOwner = user && foundUser._id.toString() === user._id.toString();
      const isAdmin = Boolean(user?.admin);
      if (user && !isOwner && !isAdmin)
        throw new Error(
          "user must request password reset or be admin. either was not true in resetPassword in user.service.js",
        );
      foundUser.passwordReset.requested = new Date();
      foundUser.passwordReset.authCode = generateAuthCode().toString();
      await foundUser.save();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  udpateUserPassword: async ({ actor, payload }) => {
    try {
      const { authCode, newPassword } = payload;
      const foundUser = await User.findOne({
        "passwordReset.authCode": authCode,
      });
      if (!foundUser)
        throw new Error(
          "we couldnt find a user in updateUserPassword in user.service.js",
        );
      foundUser.passwordHash = await hashPassword(newPassword);
      foundUser.passwordReset = null;
      await foundUser.save();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};
