const { signToken, checkPassword, hashPassword } = require("../utils/auth");
const serviceActor = { sub: "AUTH_SERVICE", role: "SERVICE" };
const { generateAuthCode } = require("../utils/auth");
const { CommService } = require("./comms.service");
const dayjs = require("dayjs");
const AUTHCODE_EXPIRY_MINUTES = 1;
const { User } = require("../models");

async function loginUser({ actor, payload }) {
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
}

async function resetUserPassword({ actor, payload }) {
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
    const authCode = generateAuthCode().toString();
    foundUser.passwordReset.authCode = authCode;
    foundUser.passwordReset.expires = dayjs().add(
      AUTHCODE_EXPIRY_MINUTES,
      "minute",
    );

    await foundUser.save();
    const notificationSent = await CommService.resetPasswordNotification({
      actor: serviceActor,
      payload: { authCode },
    });
    await foundUser.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
async function updateUserPassword({ actor, payload }) {
  try {
    const { authCode, newPassword } = payload;
    const foundUser = await User.findOne({
      "passwordReset.authCode": authCode,
    });
    if (!foundUser) {
      await User.updateMany(
        {
          passwordReset: { $exists: true, $ne: null, $ne: "" },
        },
        { passwordReset: null },
      );
      throw new Error(
        "did not find user in auth.service.js updateUserPassword, so we had to delete all password resets",
      );
    }
    const expirationDate = dayjs(foundUser.passwordReset.expires);
    if (expirationDate.isBefore(dayjs()))
      throw new Error("authCode is expired");

    foundUser.passwordHash = await hashPassword(newPassword);
    foundUser.passwordReset = null;
    await foundUser.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
async function checkAuthCode({ actor, payload }) {}

module.exports = {
  loginUser,
  checkAuthCode,
  resetUserPassword,
  updateUserPassword,
};
