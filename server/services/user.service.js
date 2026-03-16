const { User } = require("../models");
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

module.exports = {
  getUser,
  addUser,
};
