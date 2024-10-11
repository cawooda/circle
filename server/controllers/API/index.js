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
  console.log("handle setup link reached");
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
  const user = await User.findOne({ authLinkNumber: authLinkNumber });
  if (!user?._id) throw new Error("AUTH: that code didnt match");
  const token = await user.generateAuthToken();
  return {
    token,
    userExists: true,
    userCreated: false,
  };
}

async function handleLogin(body) {
  const { mobile, password, first, last } = body;
  let user = {};
  try {
    // If first and last name are provided, create a new user
    if (first && last) {
      user = await User.create({ first, last, mobile, password });
      if (user) {
        const token = await user.generateAuthToken();
        return {
          token,
          userExists: false,
          userCreated: true,
          message: "User created. Here's your token",
        };
      } else throw new Error("NOT_CREATED: could not create the user");
    }

    // If no first and last names, look for an existing user
    user = await User.findOne({ mobile: mobile });
    let token;
    if (user) {
      let correctPassword = await user.isCorrectPassword(password);
      console.log("passwordCorrect", correctPassword);
      if (correctPassword) {
        token = await user.generateAuthToken();
        return {
          token,
          userExists: true,
          userCreated: false,
          message: "User found and password correct. Here's your token",
        };
      } else throw new Error("PASSWORD: not correct");
    } else {
      throw new Error("NOT_FOUND: user does not exist");
    }
  } catch (error) {
    // Instead of returning undefined, return a structured error object
    return {
      error: true,
      message: error.message,
    };
  }
}

async function handleUserCreate(user) {
  if (user.mobile.length != 10)
    throw new Error("MOBILE:mobile not required length");
  if (user.password.length != 10)
    throw new Error("PASSWORD:password not required length");
  const userExists = await User.findOne({ mobile: req.body.mobile });
  if (!userExists) throw new Error("NOT_FOUND: User not found");

  const token = await userExists.generateAuthToken();
  return {
    userExists: true,
    userCreated: false,
    token,
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
      console.log("link request in API");
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

router.post("/users", async (req, res) => {
  req.body.mobile = req.body.mobile.replace(/[^\d]/g, "");
  try {
    const obj = await handleLogin(req.body);

    // Check if handleLogin returned an error
    if (obj.error) {
      let statusCode = 500;
      if (obj.message.match(/^PASSWORD:/)) statusCode = 401;
      if (obj.message.match(/^NOT_CREATED:/)) statusCode = 404;
      if (obj.message.match(/^NOT_FOUND:/)) statusCode = 404;

      return res.status(statusCode).json(obj);
    }

    // If no error, return the successful response object
    return res.json(obj);
  } catch (error) {
    // Handle any unexpected errors
    console.log("user api in index.js error", error);
    return res.status(500).json({
      message: "An unexpected error occurred",
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
