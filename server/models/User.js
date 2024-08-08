require("dotenv").config();
const bcrypt = require("bcrypt");
//import the Schema and model from mongoose.
const { Schema, model } = require("mongoose");
const { generateRandomNumber } = require("../utils/helpers");
const { SMSService } = require("../utils/smsService");
const userSmsService = new SMSService();
const { EMAILService } = require("../utils/mailer");
const userEmailService = new EMAILService();

const validator = require("validator"); //this package provides a range of validator checks including email.
const jwt = require("jsonwebtoken");
const Customer = require("./Customer");
const Provider = require("./Provider");
const SALT_WORK_FACTOR = process.env.SALT_WORK_FACTOR;

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
      // validate: {
      //   validator: validator.isEmail,
      //   message: "email did not pass validation",
      // },
    },
    token: String,
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
  if (!this.roleCustomer && process.env.TESTING) {
    console.log("roleCustomer Missing or null");
    try {
      const newCustomer = new Customer({
        user: this._id,
        ndisNumber: `${generateRandomNumber(9999999999, 10000000000)}`,
        address: "1 Street Name, Town, PostCode",
        dateOfBirth: "1999-07-07",
      });
      await newCustomer.save();
      this.roleCustomer = newCustomer._id;
    } catch (error) {
      console.log(error);
    }
  }

  if (!this.roleProvider && process.env.TESTING) {
    try {
      const newProvider = Provider.create({
        abn: process.env.TESTING
          ? require("../utils/helpers").generateRandomNumber(
              9999999999,
              10000000000
            )
          : "",
        address: "1 Street Name, Town, PostCode",
        providerName: "Acme Electronics",
        termsAndConditions: [
          {
            heading: "Important Terms",
            paragraph:
              "Important ParagraphImportant ParagraphImportant ParagraphImportant ParagraphImportant ParagraphImportant ParagraphImportant ParagraphImportant ParagraphImportant ParagraphImportant Paragraph",
          },
        ],
      });
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

userSchema.methods.sendMessage = async function (body, endpoint = "") {
  await userSmsService.sendText(this.mobile, body, (endPoint = ""));
  await this.sendEmail("subject", body, `<p>text</p>`, (endpoint = ""));
};

userSchema.methods.sendEmail = async function (
  subject,
  text,
  html,
  endpoint,
  attachment
) {
  console.log("user method send email reached");
  if (this.email) {
    console.log("Email exists in methods:", this.email);
    try {
      const messageSent = await userEmailService.sendMail(
        [this.email, "hello@circleindependent.com"],
        subject,
        text,
        html,
        attachment || null
      );
      console.log("Email sent successfully:", messageSent);
      return { message: messageSent };
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  } else {
    console.log("No email found for user");
    return { message: "no email" };
  }
};

userSchema.methods.sendAuthLink = async function () {
  this.authLinkNumber = generateRandomNumber(100, 4000);
  await userSmsService.sendText(
    this.mobile,
    `Resetting your login is as easy as clicking a link :)
        `,
    `/reset/${this.authLinkNumber}`
  );
};

userSchema.methods.isCorrectPassword = async function (password) {
  if (await bcrypt.compare(password, this.password)) {
    this.generateAuthToken();
  }

  return bcrypt.compare(password, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
  const user = {
    authenticatedPerson: {
      _id: this._id,
      mobile: this.mobile,
      first: this.first,
      admin: this.roleAdmin || null,
      provider: this.roleProvider || null,
      customer: this.roleCustomer || null,
    },
  };
  const token = jwt.sign(user, process.env.SECRET_KEY, {
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  });
  this.token = token;
  return token;
};

// Sanitizing of input would be handled here
userSchema.pre("save", function (next) {
  const user = this;

  if (user.email) {
    user.email = validator.normalizeEmail(user.email);
  }
  next();
});

//initialise User Model. creates a collection called user based on the defined user schema
const User = model("user", userSchema);

module.exports = User;
