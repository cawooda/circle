const router = require("express").Router();
// const { User } = require("../../models");

router.post("/", async (req, res) => {
  res.json({ message: "Post request to api recieved" });
});

module.export = { router };
