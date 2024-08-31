const router = require("express").Router();
const { User, Admin } = require("../../models");
// const { User } = require("../../models");
const { SMSService } = require("../../utils/smsService");

const controllerSmsService = new SMSService();

//javascript table ip address number of times it has failed to try a code.
//forwarded address or remote socket address

async function setupUserLink(req, res, mobile) {
  try {
    userExists = await User.findOne({ mobile: mobile }).populate([
      { path: "roleCustomer" },
      { path: "roleProvider" },
      { path: "roleAdmin" },
    ]);
    if (!userExists) {
      res.status(400).json({
        userExists: false,
        userCreated: false,
        linkSent: false,
        message: "We cant find that phone number. Did you sign up?",
      });
      return;
    }
    userExists.generateAuthToken(`30s`);
    const authNumber = await userExists.sendAuthLink();
    userExists.save();

    res.status(200).json({
      userExists: true,
      userCreated: false,
      linkSent: true,
      authNumber: authNumber,
      message: "We sent a login link and auth number to log in with",
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

router.put("/users", async (req, res) => {
  const { mobile, linkRequest, authLinkNumber } = req.body;
  //this needs to manage a request that has link:true. This would be a case where the user shouldnt be logged in but a working
  //route configured that would sign the user in without password.
  if (authLinkNumber) {
    const userExists = await User.findOne({ authLinkNumber: authLinkNumber });
    if (userExists) {
      await userExists.generateAuthToken();

      await userExists.populate([
        { path: "roleCustomer" },
        { path: "roleProvider" },
        { path: "roleAdmin" },
      ]);
      await userExists.save();
      res
        .status(200)
        .json({ userExists: true, userCreated: false, user: userExists });
    } else {
      res.status(401).json({
        userExists: false,
        userCreated: false,
        message: "that code didnt match any user or auth code",
      });
    }
    await User.updateMany(
      { authLinkNumber: { $ne: null } },
      { authLinkNumber: null }
    );
    return;
  }
  if (linkRequest) {
    setupUserLink(req, res, mobile);
    return;
  }
  try {
    const userExists = await User.findOne({ mobile: req.body.mobile });

    if (userExists) {
      if (await userExists.isCorrectPassword(req.body.password)) {
        await userExists.generateAuthToken();
        await userExists
          .populate("roleCustomer")
          .populate("roleProvider")
          .populate("roleAdmin");
        await userExists.save();
        res
          .status(200)
          .json({ userExists: true, userCreated: false, user: userExists });
      } else {
        res.status(401).json({
          userExists: true,
          userCreated: false,
          message: "We think the password wasnt right... sorry",
        });
        return;
      }
    } else {
      res.status(401).json({
        userExists: false,
        userCreated: false,
        message: "We think the user doesent yet exist. Have you signed up?",
      });
    }
  } catch (error) {
    throw new Error();
  }
});

router.post("/users", async (req, res) => {
  const user = req.body;
  if (user.mobile.length != 10) {
    res.status(400).json({
      userExists: false,
      mobileIsInvalid: true,
      userCreated: false,
      user: null,
      errorCode: "MOBILE_INVALID",
      message: "mobile not required length",
    });
    return;
  }
  if (user.password.length < 8) {
    res.status(400).json({
      userExists: false,
      userCreated: false,
      user: null,
      message: "password not required length",
    });
    return;
  }
  try {
    const userExists = await User.findOne({ mobile: req.body.mobile });
    if (userExists) {
      if (await userExists.isCorrectPassword(req.body.password)) {
        await userExists.generateAuthToken();
        await userExists.populate("roleCustomer");
        await userExists.populate("roleProvider");
        await userExists.populate("roleAdmin");
        await userExists.save();

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
      const host = process.env.HOST || `http://localhost:3000`; // Get the host (hostname:port)
      userCreated.sendMessage(
        `Welcome to Circle`,
        `Hi ${this.first}, We created you a new Circle Account. You can log in at any time using your password or SMS login at ${host}`,
        `<p>Hi ${this.first},</p> <p>We created you a new Circle Account. You can log in at any time using your password or SMS login</p><p>Circle helps custoemrs and businesses connect through service agreements and ensures work done is accurately recorded for payment and to secure records for future reference.</p><p>To find out more visit <a href="http://circleindependent.com">Cirlcle Independent</a></p><p>Have a great day :)</p>`,
        null
      );
      res
        .status(200)
        .json({ userExists: true, userCreated: true, user: userCreated });
    }
  } catch (error) {
    throw error;
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
