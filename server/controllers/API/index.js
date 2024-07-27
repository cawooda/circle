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
        controllerSmsService.sendText(
          req.body.mobile,
          "Great News, Youve created a new account with Circle. Great to have you here ;)",
          "/"
        );
        await userExists.save();
        res
          .status(200)
          .json({ userExists: true, userCreated: false, user: userExists });
        return userExists;
      }
    } else {
      const userCreated = await User.create(user);
      userCreated.save();
      await userCreated.generateAuthToken();
      controllerSmsService.sendText(
        req.body.mobile,
        `Great News, Youve signed in ;)
        `,
        "/"
      );
      res
        .status(200)
        .json({ userExists: true, userCreated: true, user: userExists });
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
