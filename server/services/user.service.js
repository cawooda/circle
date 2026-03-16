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
  const { mobile, email } = payload;
  const newUser = new User({
    contact: { mobile, email },
  });

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

async function updateUserProfile({ actor, payload }) {
  const userToUpdate = await User.findById(sub);
  if (!userToUpdate) {
    throw new Error("User not found");
  } else {
    await userToUpdate.updateOne({
      first: first,
      last: last,
      contact: { mobile: mobile, email: email },
    });
    await userToUpdate.save();
    return userToUpdate;

    await userEmailService.sendMail(
      updatedUser.email,
      "Profile updated",
      `Hi ${first}, we have updated your profile. Have a great day :)
            `,
      `Hi ${first}, we have updated your profile`,
      `<p>Hi ${first}, we have updated your profile</p>
            <h3>firstName:</h3>
            <h4>${first}</h4>
            <h3>Last Name:</h3>
            <h4> ${last}</h4>
            <h3>mobile:</h3>
            <h4> ${mobile}</h4>
            <h3>email:</h3>
            <h4> ${email}</h4>
            `,
    );
  }
}

module.exports = {
  getUser,
  addUser,
};
