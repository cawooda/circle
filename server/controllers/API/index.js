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
    const authNumber = await userExists.sendAuthLink();
    console.log(authNumber);
    res.status(200).json({
      userExists: true,
      userCreated: false,
      linkSent: true,
      message: "We sent a login link and auth number to log in with",
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

router.put("/users", async (req, res) => {
  const { mobile, linkRequest, authLinkNumber } = req.body;

  try {
    let returnObject = {};
    let user = {};
    if (authLinkNumber) {
      user = await User.findOne({ authLinkNumber: authLinkNumber });

      if (user?._id) {
        const token = await user.generateAuthToken();
        returnObject = {
          user,
          token,
          userExists: true,
          validCode: true,
          userCreated: false,
        };
      } else {
        res.status(401).json({
          validCode: false,
          userExists: false,
          validCode: false,
          message:
            "That code didn't match any user or auth code, which could mean the link is expired.",
        });
        return;
      }
      // await User.updateMany(
      //   { authLinkNumber: { $ne: null } },
      //   { authLinkNumber: null }
      // );
    }

    if (linkRequest) {
      setupUserLink(req, res, mobile);
      return;
    }

    // Check if user exists based on mobile and handle password
    if (!authLinkNumber && !linkRequest) {
      const user = await User.findOne({ mobile: req.body.mobile });
      if (!user?._id)
        throw new Error("couldnt find the user for regular login");
      if (!user?.isCorrectPassword(req.body.password))
        throw new Error("Password didnt work");
      const token = await user.generateAuthToken();
      await user
        .populate("roleCustomer")
        .populate("roleProvider")
        .populate({
          path: "roleProvider",
          populate: [
            {
              path: "termsAndConditions",
            },
            {
              path: "services",
              model: "service",
              populate: {
                path: "product",
                model: "product",
              },
            },
            {
              path: "linkedCustomers",
              model: "customer",
              populate: {
                path: "user", // Nested population of linkedCustomers' user
                model: "user",
              },
            },
          ],
        })
        .populate("roleAdmin")
        .exec();
      returnObject = {
        ...returnObject,
        user,
        token,
        userExists: true,
        userCreated: false,
        message: "here is your user",
      };
    }
    res.status(200).json(returnObject);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while processing the request.",
      error: error.message || "Unknown error",
    });
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

  try {
    const userExists = await User.findOne({ mobile: req.body.mobile })
      .populate("roleCustomer")
      .populate("roleProvider")
      .populate({
        path: "roleProvider",
        populate: [
          {
            path: "termsAndConditions",
          },
          {
            path: "services",
            model: "service",
            populate: {
              path: "product",
              model: "product",
            },
          },
          {
            path: "linkedCustomers",
            model: "customer",
            populate: {
              path: "user", // Nested population of linkedCustomers' user
              model: "user",
            },
          },
        ],
      })
      .populate("roleAdmin")
      .exec();

    if (userExists) {
      if (await userExists.isCorrectPassword(req.body.password)) {
        const token = await userExists.generateAuthToken();

        res.status(200).json({
          userExists: true,
          userCreated: false,
          user: userExists,
          token,
        });
        return userExists;
      } else {
        res.status(400).json({
          userExists: true,
          userCreated: false,
          errorCode: "INCORRECT_PASSWORD",
          message: "password Incorrect",
        });
      }
    } else {
      //wishing not to take more information than required from a user, this app allows registration with only mobile, however we use the below code to

      const userCreated = await User.create({
        first: "firstName",
        last: "lastName",
        ...user,
      });
      userCreated.save();
      const token = await userCreated.generateAuthToken();
      const host = process.env.HOST || `http://localhost:3000`; // Get the host (hostname:port)
      userCreated.sendMessage(
        `Welcome to Circle`,
        `Hi , We created you a new Circle Account. You can log in at any time using your password or SMS login at ${host}`,
        `<p>Hi</p> <p>We created you a new Circle Account. You can log in at any time using your password or SMS login</p><p>Circle helps custoemrs and businesses connect through service agreements and ensures work done is accurately recorded for payment and to secure records for future reference.</p><p>To find out more visit <a href="http://circleindependent.com">Cirlcle Independent</a></p><p>Have a great day :)</p>`,
        null
      );
      res.status(200).json({
        userExists: true,
        userCreated: true,
        user: userCreated,
        token,
      });
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
