//Issues
//This put is sending the user back differently depending on the method of login.

const router = require("express").Router();
const { User, Admin } = require("../../models");
// const { User } = require("../../models");
const { SMSService } = require("../../utils/smsService");
const { addUser } = require("../../services/user.service");
const {
  loginUser,
  updateUserPassword,
} = require("../../services/auth.service");
const controllerSmsService = new SMSService();
const emailService = require("../../utils/mailer").EMAILService;

// implementing load limiting for sms queries:
//javascript table ip address number of times it has failed to try a code.
//forwarded address or remote socket address

async function handleSetupUserLink(mobile) {
  const userExists = await User.findOne({ mobile: mobile });

  if (!userExists) throw new Error("NOT_FOUND: user doesnt exist");
  const authNumber = await userExists.sendAuthLink();
  console.log("authNumber", authNumber);
  return {
    userExists: true,
    userCreated: false,
    linkSent: true,
    message: "We sent a login link and auth number to log in with",
  };
}

async function handleAuthLinkNumber(authLinkNumber, res) {
  const user = await User.findOne({
    resetPassword: { authCode: authLinkNumber },
  });
  if (!user?._id) throw new Error("AUTH: that code didnt match");
  const token = await user.token;
  return {
    token,
    userExists: true,
    userCreated: false,
  };
}

router.put("/users", async (req, res) => {
  const { mobile, linkRequest } = req.body;
  //refactor to its own controller
  try {
    if (authLinkNumber) {
      const obj = await handleAuthLinkNumber(authLinkNumber);
      return await res.send(obj);
    }
    if (linkRequest) {
      const obj = await handleSetupUserLink(mobile);
      return await res.json(obj);
    }
  } catch (error) {
    console.log("error in index.js ", error);
    let statusCode = 500;
    //start with AUTH and has a :
    if (error.message.match(/^AUTH:/)) statusCode = 401;
    if (error.message.match(/^NOT_FOUND:/)) statusCode = 404;
    return await res.status(statusCode).json({
      message: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  req.body.contact.mobile = req.body.contact.mobile.replace(/[^\d]/g, "");
  try {
    const { token, message } = await loginUser({
      actor: "API_CONTROLLER",
      payload: req.body,
    });
    if (!token)
      throw new Error(
        `loginUser in /login controller failed with message: ${message}`,
      );
    return res.json({
      success: true,
      message: "login successful",
      token: token,
    });
  } catch (error) {
    console.log("user api in index.js error", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      user: null,
      token: null,
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const contact = req.body?.contact;
    const first = req.body?.first;
    const mobile = contact?.mobile || null;
    const email = contact?.email || null;

    if (!email && !mobile)
      throw new Error(
        "CONTACT_NOT_PRESENT:email or mobile must be present in contact",
      );

    const newUser = await addUser({
      actor: { sub: "API_CONTROLLER", role: "CONTROLLER" },
      payload: {
        contact: { mobile: mobile || null, email: email || null },
        first: first,
      },
    });

    return res
      .status(201)
      .json({ succes: true, message: "user created", user: newUser });
  } catch (error) {
    console.log(error);
    if (error.message.includes("E1100"))
      return res.status(400).json({
        succes: false,
        message: "That user might already exist. try login",
        user: null,
      });
    if (error.message.includes("CONTACT_NOT_PRESENT"))
      return res.status(400).json({
        succes: false,
        message: "contact details required for signing new user",
        user: null,
      });
  }
});

router.post("/updateuserpassword", async (req, res) => {
  try {
    console.log(req.body);
    const { password, authCode } = req.body;

    if (!authCode)
      throw new Error("NO_AUTHCODE:an authcode is required for that");
    if (!password)
      throw new Error("NO_PASSWORD:a password is required for that");
    const { success, message } = updateUserPassword({
      actor: "CONTROLLER",
      payload: { authCode, password },
    });
    return res.status(201).json({ success, message });
  } catch (error) {
    console.log(error);
    if (error.message.includes("E1100"))
      return res.status(400).json({
        message: "We failed to create a user. Are they aleady registered?",
      });
    if (error.message.includes("UNIDENTIFIED_CONTACT"))
      return res.status(400).json({
        message: "UNIDENTIFIED_CONTACT: Email or Mobile is required",
      });
  }
});

router.use("/users/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id).populate().lean();
  const admin = await Admin.findOne({ user: id }).lean();
  return await res.json({ user: user, admin: admin });
});

router.use("/", async (req, res) => {
  return await res.send({ message: "Post request to api recieved" });
});

module.exports = router;
