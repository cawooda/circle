const { signToken, checkPassword, hashPassword } = require("../utils/auth");
const serviceActor = { sub: "AUTH_SERVICE", role: "SERVICE" };
const { generateAuthCode } = require("../utils/auth");
const { CommService } = require("./comms.service");
const dayjs = require("dayjs");
const AUTHCODE_EXPIRY_MINUTES = 2;
const { User } = require("../models");

//authentication is this who they say they are - middleware
//authorisation extracted from the token and passed to function to check whether they are allowed to do?
//function checks the authorisation doesent bother itself with authentication
//authentication should be handled by middlware / dedicated auth endpoint eg. /auth/
//RULES:
// auth should return a object with {success,message,token} for all successful logins
// auth should return {success,message} for all other requests
// all other information should come from other services.

async function loginUser({ actor, payload }) {
  //contact information is used as the actor in login
  try {
    if (!actor == "API_CONTROLLER")
      throw new Error(
        "we need the api controller to request login with credentials",
      );
    const { contact, password } = payload;
    const { email, mobile } = contact;
    const foundUser = await User.findOne({
      $or: [
        { "contact.email": email?.toLowerCase() || null },
        { "contact.mobile": mobile || null },
      ],
    });

    if (!foundUser?.passwordHash)
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
    console.log(token);
    return {
      success: true,
      message: "user logged in successfully by auth.service",
      token,
    };
  } catch (error) {
    console.log("error iin loginUser in auth.service.js", error);
    return {
      success: false,
      message: "user not logged in",
      token: null,
    };
  }
}
async function resetUserPassword({ actor, payload }) {
  try {
    const { user } = payload;

    const authCode = generateAuthCode().toString();
    user.passwordReset.authCode = authCode;
    user.passwordReset.expires = dayjs().add(AUTHCODE_EXPIRY_MINUTES, "minute");

    await user.save();

    return {
      success: true,
      message: "user password reset successfully by auth.service",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "user password reset failed in auth.service",
    };
  }
}
async function updateUserPassword({ actor, payload }) {
  try {
    const { authCode, password } = payload;
    if (!authCode || !password)
      throw new Error("REJECTED: we need an authcode and password for that");
    const passwordHash = await hashPassword(password);
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

    foundUser.passwordHash = passwordHash;
    foundUser.passwordReset = null;
    await foundUser.save();
    return {
      success: true,
      message: "user password updated successfully in auth.service",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "user password update failed in auth.service",
    };
  }
}
// async function checkAuthCode({ actor, payload }) {}
async function logout({ actor, payload }) {
  try {
    const { sub } = payload;
    const user = User.findById(sub);
    user.loggedOut = true;
    user.save();
    return {
      success: true,
      message: "user logged out successfully in auth.service",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: `user log out failed in auth.service giving error message: ${error.message}`,
    };
  }
}

module.exports = {
  loginUser,
  // checkAuthCode,
  resetUserPassword,
  updateUserPassword,
  logout,
};
