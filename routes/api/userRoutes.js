const express = require("express");
const router = express.Router();

//methods within the controller handle CRUD requests. The methods are imported here
const {
  getUsers,
  getSingleUser,
  createUser,
} = require("../../controllers/userController");

// get all users
router.route("/").post(createUser).get(getUsers);

router.route("/:userId").get(getSingleUser);

module.exports = router;
