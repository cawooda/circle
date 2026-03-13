const { User } = require("../models");
const { generateAuthCode, hashPassword } = require("../utils/auth");
const { CommService } = require("./comms.service");
const serviceActor = { sub: "USER_SERVICE", role: "SERVICE" };

async function getUser({ actor, payload }) {
  try {
    const { userId } = payload;
    const foundUser = User.findById(userId);
    return foundUser;
  } catch (error) {
    console.log("error in getUser from user.service.js", error);
  }
}

async function addUser({ actor, payload }) {
  const { first, last, mobile, email, dateOfBirth } = payload;
  const newUser = new User({
    first,
    last,
    contact: { mobile, email },
    dateOfBirth,
  });
  console.log("newUser", newUser);
  if (!newUser)
    throw new Error(
      "FAILED:We couldnt create the user in addUser in user.service.js",
    );
  await newUser.save();
  //need to send authLink to prove contact details and set token
  const passwordReset = await resetUserPassword({
    actor: serviceActor,
    payload: { contact: newUser.contact },
  });
  if (!passwordReset) throw new Error("we counldnt reset password");

  return newUser;
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
    foundUser.passwordReset.requested = new Date();
    const authCode = generateAuthCode().toString();

    foundUser.passwordReset.authCode = authCode;
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

async function udpateUserPassword({ actor, payload }) {
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
}

module.exports = {
  getUser,
  addUser,
  resetUserPassword,
  udpateUserPassword,
};
