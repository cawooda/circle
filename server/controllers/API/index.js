const router = require("express").Router();
const { User, Admin } = require("../../models");
// const { User } = require("../../models");
const { SMSService } = require("../../utils/smsService");

const controllerSmsService = new SMSService();

router.post("/users", async (req, res) => {
  const user = req.body;

  try {
    const userExists = await User.findOne({ mobile: req.body.mobile });

    if (userExists) {
      if (userExists.isCorrectPassword(req.body.password)) {
        await userExists.generateAuthToken();

        await userExists.populate("roleCustomer");
        await userExists.populate("roleProvider");
        await userExists.save();
        res
          .status(200)
          .json({ userExists: true, userCreated: false, user: userExists });
        return userExists;
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
      controllerSmsService.sendText(
        req.body.mobile,
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
