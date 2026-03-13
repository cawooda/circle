const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

//import the Schema and model from mongoose.
const { Schema, model, models } = require("mongoose");
const {
  generateRandomNumber,
  generateRandomPhoneNumber,
} = require("../utils/helpers");
const { SMSService } = require("../utils/smsService");
const userSmsService = new SMSService();
const { EMAILService } = require("../utils/mailer");
const userEmailService = new EMAILService();

// const validator = require("validator");

//defind the user model schema
const userSchema = new Schema(
  //first come the paths, like properties
  {
    first: String,
    last: String,
    contact: {
      mobile: {
        type: String,
        minLength: 10,
        maxLength: 10,
        default: generateRandomPhoneNumber,
        unique: true,
      },
      email: {
        type: String,
        toLowerCase: true,
        unique: true,
      },
    },
    customer: {
      active: { type: Boolean, default: true },
      invoiceEmail: {
        type: String,
        required: true,
        default: "default@default.com",
      },
      serviceAgreementEmail: {
        type: String,
        required: true,
        default: "service@serviceagreementemail.com",
      },
      referenceNumber: {
        type: String,
        required: true,
        default: generateRandomNumber(1000000000, 9999999999),
      },
      referenceName: {
        type: String,
        required: true,
        default: "Reference Number",
      },
      address: {
        street: { type: String, required: true, default: "123 Default St" },
        city: { type: String, required: true, default: "Default City" },
        state: { type: String, required: true, default: "Default State" },
        postalCode: { type: String, required: true, default: "00000" },
      },
      dateOfBirth: { type: Date, required: true, default: "1999-07-07" },
      customerSpecificField: { type: String },
      shifts: [{ type: Schema.Types.ObjectId, ref: "shift" }],
      serviceAgreements: [{ type: Schema.Types.ObjectId, ref: "agreement" }],
    },
    provider: {
      active: { type: Boolean, default: false },
      abn: {
        type: String,
      },
      address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
      },
      providerName: { type: String },
      termsAndConditions: {
        type: [
          {
            heading: {
              type: String,
            },
            paragraph: { type: String },
          },
        ],
      },
      notes: { type: String },
      linkedCustomers: [
        {
          type: Schema.Types.ObjectId,
          ref: "customer",
        },
      ],
      services: [
        {
          type: Schema.Types.ObjectId,
          ref: "service",
          required: true,
        },
      ],
      products: [
        {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
      ],
      serviceAgreements: [{ type: Schema.Types.ObjectId, ref: "agreement" }],
      shifts: [{ type: Schema.Types.ObjectId, ref: "shift" }],
      logoUrl: String,
    },
    admin: {
      users: [
        {
          type: Schema.Types.ObjectId,
          ref: "user",
          default: [],
        },
      ],
    },
    superAdmin: { type: Boolean, required: true, default: false },
    passwordHash: { type: String },
    passwordReset: {
      requested: { type: Date },
      authCode: { type: String },
      complete: { type: Boolean },
    },
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

//initialise User Model. creates a collection called user based on the defined user schema
const User = models.user || model("user", userSchema);

module.exports = User;
