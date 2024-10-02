//Issues
//This put is sending the user back differently depending on the method of login.

const router = require("express").Router();
const { User, Admin } = require("../../models");
// const { User } = require("../../models");
const { SMSService } = require("../../utils/smsService");

const controllerSmsService = new SMSService();

// implementing load limiting for sms queries:
//javascript table ip address number of times it has failed to try a code.
//forwarded address or remote socket address

async function handleSetupUserLink(mobile) {
  const userExists = await User.findOne({ mobile: mobile });
  if (!userExists) throw new Error("NOT_FOUND: user doesnt exist");
  const authNumber = await userExists.sendAuthLink();
  console.log(authNumber);
  return {
    userExists: true,
    userCreated: false,
    linkSent: true,
    message: "We sent a login link and auth number to log in with",
  };
}

async function handleAuthLinkNumber(authLinkNumber, res) {
  const user = await User.findOne({ authLinkNumber: authLinkNumber });
  if (!user?._id) throw new Error("AUTH: that code didnt match");
  const token = await user.generateAuthToken();
  return {
    token,
    userExists: true,
    userCreated: false,
  };
}

async function handleLogin(mobile, password) {
  const user = await User.findOne({ mobile: mobile });
  if (!user?._id)
    throw new Error(
      "NOT_FOUND: couldnt find the user for mobile and password login"
    );
  if (!user?.isCorrectPassword(password))
    throw new Error("Password didnt work");
  const token = await user.generateAuthToken();

  return {
    token,
    userExists: true,
    userCreated: false,
    message: "user found and password correct. Here's your token",
  };
}

router.put("/users", async (req, res) => {
  const { mobile, linkRequest, authLinkNumber } = req.body;
  //refactor to its own controller
  try {
    if (authLinkNumber) {
      const obj = await handleAuthLinkNumber(authLinkNumber);
      return await res.send(obj);
    }
    if (linkRequest) {
      const obj = await handleSetupUserLink(mobile);
      return await res.send(obj);
    }
    if (!authLinkNumber && !linkRequest)
      return await res.send(handleLogin(mobile, password));
  } catch (error) {
    console.log(error);
    let statusCode = 500;
    //start with AUTH and has a :
    if (error.message.match(/^AUTH:/)) statusCode = 401;
    if (error.message.match(/^NOT_FOUND:/)) statusCode = 404;
    res.status(statusCode).json({
      message: error.message,
    });
  }
});

router.post("/users", async (req, res) => {
  //refactor to respond with a token. App should not rely on anything but the token.
  const user = req.body;
  console.log("req.body", req.body);
  // Sanitize the input
  req.body.mobile = req.body.mobile.replace(/[^\d]/g, ""); // Remove any non-numeric characters
  if (user.mobile.length != 10) {
    console.log(user.mobile.length);
  }
  try {
    const userExists = await User.findOne({ mobile: req.body.mobile });

    if (userExists) {
      const token = await userExists.generateAuthToken();
      res.status(200).json({
        userExists: true,
        userCreated: false,

        token,
      });
      return userExists;
    } else {
      const userCreated = await User.create({ ...user });

      const token = await userCreated.generateAuthToken();
      res.status(200).json({
        userExists: false,
        userCreated: true,

        token,
      });
      return;
    }
  } catch (error) {
    const prep = {};
    console.error(error);
    if ((error.message = "INVALID_MOBILE")) {
      prep.errorCode = "INVALID_MOBILE";
      res.status(400).json({
        ...prep,
      });
    }
    throw error("an error occurred", error.message);
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
