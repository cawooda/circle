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
const parsedSaltRounds = Number.parseInt(
  process.env.SALT_WORK_FACTOR ?? "10",
  10,
);
const SALT_WORK_FACTOR = Number.isInteger(parsedSaltRounds)
  ? parsedSaltRounds
  : 10;

const secret = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");

const signToken = (payload, expiresIn) => {
  if (!expiresIn) expiresIn = process.env.TOKEN_EXPIRES_IN;

  const token = jwt.sign(payload, secret, {
    expiresIn,
  });

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
    passwordHash: { type: String },
    authLinkNumber: { type: String },
    sendEmails: { type: Boolean, default: true },
    sendTexts: { type: Boolean, default: true },
  },
  //then come the
  {
    timestamps: true, // This will automatically manage createdAt and updatedAt fields
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  },
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

userSchema.virtual("password").set(function (plain) {
  this._plainPassword = plain; // temporary, not persisted
});

userSchema.pre("save", async function () {
  // Basic length check (you can add stronger rules elsewhere)
  if (this._plainPassword?.length < 10) {
    throw new Error("Password must be at least 10 characters.");
  }
  if (this._plainPassword) {
    this.passwordHash = await bcrypt.hash(
      this._plainPassword,
      SALT_WORK_FACTOR,
    );
    this.passwordChangedAt = new Date();
    this._plainPassword = undefined;
  }
  if (!this.roleCustomer) {
    const newCustomer = new Customer({
      user: this._id,
    });
    await newCustomer.save();
    this.roleCustomer = newCustomer._id;
  }
  //asign a new default provider role if the user doesn't have one. this ensures that every user has a provider and customer role, which simplifies the logic in other parts of the app. we can check if a user has an active provider or customer profile by checking if these fields are populated, rather than having to handle null values.
  if (!this.roleProvider) {
    const newProvider = new Provider({});
    newProvider.user = this._id;
    this.roleProvider = newProvider._id;
    await newProvider.save();
  }

  // Generate token after the user is saved
  if (this.isNew) {
    this.generateAuthToken();
  }
});

userSchema.methods.sendAuthLink = async function () {
  let simpleNumber = generateRandomNumber(1000, 9999).toString();
  let simpleNumberArray = simpleNumber.split("");

  const complexCode = simpleNumberArray
    .map((digit, index) => {
      // Convert the string 'digit' to a number and generate lowercase letters.
      if (index % 2 === 1) {
        return String.fromCharCode(65 + parseInt(digit)).toLowerCase(); // 'a' = 97, 'A' = 65
      } else {
        return digit; // Keep original digit for even indices
      }
    })
    .join(""); // Join without commas
  console.log("complexified", this.authLinkNumber);
  this.authLinkNumber = complexCode;

  this.save();
  const host = process.env.HOST || `http://localhost:3000`; // Get the host (hostname:port)
  const fullUrl = `${host}/auth/${this.authLinkNumber}`;

  this.sendMessage(
    `Circle Login`,
    `Logging in is easy with the following link: ${fullUrl} CODE: ${this.authLinkNumber}  :)`,
    `<p>Logging in is easy with the following link. </p><p>${fullUrl}</p> <p>Your Temporary Access Code is :</p> <h3>${this.authLinkNumber} </h3>  :)`,
    null,
  );

  return this.authLinkNumber;
};

userSchema.methods.sendMessage = async function (
  subject,
  body,
  html,
  attachment,
) {
  try {
    if (this.sendTexts) userSmsService.sendText(this.mobile, body);
  } catch (error) {
    throw new Error("sms service in user schema send message errorred", error);
  }
  try {
    if (this.email) this.sendEmail(subject, body, html, attachment);
  } catch (error) {
    throw new Error(
      `email service in user schema send message errorred ${error.message}`,
    );
  }
};

userSchema.methods.sendEmail = async function (
  subject,
  body,
  html,
  attachment,
) {
  if (this.email) {
    try {
      const messageSent = await userEmailService.sendMail(
        [this.email, "hello@circleindependent.com"],
        subject,
        null,
        html,
        attachment || null,
      );
      return { message: messageSent };
    } catch (error) {
      throw new Error(
        `email service in user schema send message errorred ${error.message}`,
      );
    }
  } else {
    throw new Error("No email found for user");
  }
};

userSchema.methods.isCorrectPassword = async function (password) {
  if (await bcrypt.compare(password, this.passwordHash)) {
    return true;
  } else return false;
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function (
  expiresIn = process.env.TOKEN_EXPIRES_IN,
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
