const router = require("express").Router();
const { User, Admin } = require("../../models");
// const { User } = require("../../models");

router.post("/users", async (req, res) => {
  const user = req.body;
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists.isCorrectPassword(req.body.password)) {
      await userExists.generateAuthToken();
      res
        .status(200)
        .json({ userExists: true, userCreated: false, user: userExists });
      return userExists;
    }
    userCreated = await User.create(user);

    res
      .status(200)
      .json({ userExists: true, userCreated: true, user: userExists });
  } catch (error) {
    console.log(error);
  }
});

router.use("/users/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id).populate().lean();
  const admin = await Admin.findOne({ user: id }).lean();
  res.json({ user: user, admin: admin });
});

router.use("/", async (req, res) => {
  res.send({ message: "Post request to api recieved" });
});

module.exports = router;
