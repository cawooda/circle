const router = require("express").Router();
const { User, Admin } = require("../../models");
// const { User } = require("../../models");

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
