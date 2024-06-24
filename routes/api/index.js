//import the Router method to create a Router
const router = require("express").Router();

//import a route for Users
const userRoutes = require("./userRoutes");

//mount the middlewhere to handle all calls to /api/users
router.use("/users", userRoutes);

router.get("/", (req, res) => {
  res.status(200).json({ message: "reached api" });
});

module.exports = router;
