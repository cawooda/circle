const User = require("../../../models/User");
module.exports = {
  updateUserProfile: async (_parent, input, context) => {
    const user = await User.findById(context.user._id);
    user.set("contact.email", input.contact.email);
    user.set("contact.mobile", input.contact.mobile);
    user.set("first", input.first);
    user.set("last", input.last);
    user.set("dateOfBirth", input.dateOfBirth);
    return user;
  },
};
