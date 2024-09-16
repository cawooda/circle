require("dotenv").config();
const bcrypt = require("bcrypt");
//import the Schema and model from mongoose.
const { Schema, model } = require("mongoose");
const { generateRandomNumber } = require("../utils/helpers");
const { SMSService } = require("../utils/smsService");
const userSmsService = new SMSService();
const { EMAILService } = require("../utils/mailer");
const userEmailService = new EMAILService();

const validator = require("validator");

const Customer = require("./Customer");
const Provider = require("./Provider");
const SALT_WORK_FACTOR = process.env.SALT_WORK_FACTOR;

const secret = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");
const signToken = (payload, expiresIn) => {
  if (!expiresIn) expiresIn = process.env.TOKEN_EXPIRES_IN;

  const token = jwt.sign(payload, secret, {
    expiresIn,
  });
  const decodedToken = jwt.decode(token);

  return token;
};

//defind the user model schema
const userSchema = new Schema(
  //first come the paths, like properties
  {
    first: String,
    last: String,
    mobile: {
      type: String,
      minLength: 10,
      maxLength: 10,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      toLowerCase: true,
    },
    roleCustomer: {
      type: Schema.Types.ObjectId,
      ref: "customer",
      default: null,
    },
    roleProvider: {
      type: Schema.Types.ObjectId,
      ref: "provider",
      default: null,
    },
    roleAdmin: {
      type: Schema.Types.ObjectId,
      ref: "admin",
      default: null,
    },
    roleSuperAdmin: { type: Boolean, required: true, default: false },
    // roles: [
    //   { type: String, enum: ["Customer", "Provider", "Admin", "SuperAdmin"] },
    // ],
    // roleModels: [{ type: Schema.Types.ObjectId }],
    password: { type: String, required: true },
    authLinkNumber: { type: String },
    sendEmails: { type: Boolean, default: true },
    sendTexts: { type: Boolean, default: true },
    createdAt: {
      type: Date,
      immutable: true, //this prevents changes to the date once created
      default: () => Date.now(), //runs a function to get the current date when populating
    },
    updatedAt: {
      type: Date,
      default: () => Date.now(),
    },
  },
  //then come the
  {
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  }
);

userSchema
  .virtual("fullName")
  //getter
  .get(function () {
    return `${this.first} ${this.last}`;
  })
  .set(function (value) {
    const splitName = value.split(" ");
    const first = splitName[0];
    const last = splitName[1];
    this.set({ first, last });
  });

userSchema.pre("save", async function (next) {
  if (!this.roleCustomer) {
    try {
      const newCustomer = new Customer({
        user: this._id,
      });
      await newCustomer.save();
      this.roleCustomer = newCustomer._id;
    } catch (error) {
      console.log(error);
    }
  }

  if (!this.roleProvider && process.env.TESTING) {
    try {
      const newProvider = new Provider({});
      await newProvider.save();
      newProvider.user = this._id;
      this.roleProvider = newProvider._id;
    } catch (error) {
      console.log(error);
    }
  }

  if (this.isModified("password") || this.isNew) {
    try {
      // Generate salt and hash the password
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  // Generate token after the user is saved
  if (this.isNew) {
    this.generateAuthToken();
  }
  next();
});

userSchema.methods.sendAuthLink = async function () {
  this.authLinkNumber = generateRandomNumber(1000, 9999);
  const host = process.env.HOST || `http://localhost:3000`; // Get the host (hostname:port)
  const fullUrl = `${host}/auth/${this.authLinkNumber}`;

  await this.sendMessage(
    `Circle Login`,
    `Logging in is easy with the following link: ${fullUrl} CODE: ${this.authLinkNumber}  :)`,
    `<p>Logging in is easy with the following link. </p><p>${fullUrl}</p> <p>Your Temporary Access Code is :</p> <h3>${this.authLinkNumber} </h3>  :)`,
    null
  );
  return this.authLinkNumber;
};

userSchema.methods.sendMessage = async function (
  subject,
  body,
  html,
  attachment
) {
  try {
    if (this.sendTexts) await userSmsService.sendText(this.mobile, body);
  } catch (error) {
    throw new Error("sms service in user schema send message errorred", error);
  }
  try {
    if (this.email) await this.sendEmail(subject, body, html, attachment);
  } catch (error) {
    throw new Error(
      "email service in user schema send message errorred",
      error
    );
  }
};

userSchema.methods.sendEmail = async function (
  subject,
  body,
  html,
  attachment
) {
  if (this.email) {
    try {
      const messageSent = await userEmailService.sendMail(
        [this.email, "hello@circleindependent.com"],
        subject,
        null,
        html,
        attachment || null
      );
      return { message: messageSent };
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  } else {
    throw new Error("No email found for user");
  }
};

userSchema.methods.isCorrectPassword = async function (password) {
  if (await bcrypt.compare(password, this.password)) {
    this.generateAuthToken();
  }

  return bcrypt.compare(password, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function (
  expiresIn = process.env.TOKEN_EXPIRES_IN
) {
  const user = {
    authenticatedPerson: {
      _id: this._id,
      mobile: this.mobile,
      first: this.first,
      admin: this.roleAdmin ? true : false,
      provider: this.roleProvider ? true : false,
      customer: this.roleCustomer ? true : false,
      createdAt: new Date(),
    },
  };

  const token = signToken(user, expiresIn);
  const verifiedToken = jwt.verify(token, secret, {
    maxAge: process.env.TOKEN_EXPIRES_IN,
  });

  return token;
};

//initialise User Model. creates a collection called user based on the defined user schema
const User = model("user", userSchema);

module.exports = User;
