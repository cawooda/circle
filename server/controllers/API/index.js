const router = require("express").Router();
// const { User } = require("../../models");

router.use("/", async (req, res) => {
  res.send({ message: "Post request to api recieved" });
});

module.exports = router;
