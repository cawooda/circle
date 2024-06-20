//require the model for retureivng information from database
const User = require("../models/User");

//export all the modules in one go. this can be done by defining and then calling module.exports

//a get request for all users
getUsers = async (req, res) => {
  try {
    //do the call the db for all users
    const users = await User.find();
    //return them all
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

getSingleUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.user_id }).select("-__v");
    //handle situations where a user doesent exust by that id
    if (!user) {
      return res.status(404).json({ message: "No User with that Id" });
    }
    //return the user
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

createUser = async (req, res) => {
  const { first, last, email, password } = req.body;
  //extract the items from the body
  if (!first || !last || !email || !password) {
    return res
      .status()
      .json({ message: "need name, email and password for user creation" });
  }
  try {
    const dbUserData = await User.create({ first, last, email, password });
    dbUserData.save();
    res.json(dbUserData);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { getUsers, getSingleUser, createUser };
