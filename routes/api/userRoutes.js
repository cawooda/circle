const express = require("express");
const router = express.Router();

//methods within the controller handle CRUD requests. The methods are imported here
const {
  getUsers,
  getSingleUser,
  createUser,
  modifyUser,
} = require("../../controllers/userController");

//all users
router.route("/").post(createUser).get(getUsers);
//single user
router.route("/:userId").post(modifyUser).get(getSingleUser);
//login user
router.route("/login").post(loginUser);

module.exports = router;
