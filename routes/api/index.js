//import the Router method to create a Router
const router = require("express").Router();

//import a route for Users
const userRoutes = require("./userRoutes");

//mount the middlewhere to handle all calls to /api/users
router.use("/users", userRoutes);

module.exports = router;
