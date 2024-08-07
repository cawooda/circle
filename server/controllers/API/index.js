const router = require("express").Router();
const { User, Admin } = require("../../models");
// const { User } = require("../../models");
const { SMSService } = require("../../utils/smsService");

const controllerSmsService = new SMSService();

router.put("/users", async (req, res) => {
  const { mobile } = req.body;
  console.log("put recieved");
  try {
    const userExists = await User.findOne({ mobile: req.body.mobile });
    console.log("user exists");
    if (userExists) {
      await userExists.sendAuthLink();
      res.status(401).json({
        userExists: true,
        userCreated: false,
        authLinkSent: true,
        message: "auth link Sent",
      });
    } else {
      res.status(401).json({
        userExists: false,
        userCreated: false,
        message: "user doesent exist",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/users", async (req, res) => {
  const user = req.body;

  try {
    const userExists = await User.findOne({ mobile: req.body.mobile });

    if (userExists) {
      if (await userExists.isCorrectPassword(req.body.password)) {
        await userExists.generateAuthToken();
        await userExists.populate("roleCustomer");
        await userExists.populate("roleProvider");
        await userExists.populate("roleAdmin");
        await userExists.save();
        console.log("userExists", userExists);
        res
          .status(200)
          .json({ userExists: true, userCreated: false, user: userExists });
        return userExists;
      } else {
        res.status(401).json({
          userExists: true,
          userCreated: false,
          message: "Incorrect password",
        });
      }
    } else {
      //wishing not to take more information than required from a user, this app allows registration with only mobile, however we use the below code to
      //create dummy data for some fields
      const userCreated = await User.create({
        first: "firstName",
        last: "lastName",
        ...user,
      });
      userCreated.save();
      await userCreated.generateAuthToken();
      userCreated.message(
        `Great News, We've just given you a Circle Account ;)
        `,
        "/"
      );
      res
        .status(200)
        .json({ userExists: true, userCreated: true, user: userCreated });
    }
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
