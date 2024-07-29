require("dotenv").config();
const bcrypt = require("bcrypt");
//import the Schema and model from mongoose.
const { Schema, model } = require("mongoose");
const { generateRandom10DigitNumber } = require("../utils/helpers");

const validator = require("validator"); //this package provides a range of validator checks including email.
const jwt = require("jsonwebtoken");
const Customer = require("./Customer");
const Provider = require("./Provider");
const SALT_WORK_FACTOR = process.env.SALT_WORK_FACTOR;
console.log(SALT_WORK_FACTOR);

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
    },
    email: {
      type: String,
      toLowerCase: true,
      validate: {
        validator: validator.isEmail,
        message: "email did not pass validation",
      },
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
    roleAdmin: { type: Schema.Types.ObjectId, ref: "admin", default: null },

    // roles: [
    //   { type: String, enum: ["Customer", "Provider", "Admin", "SuperAdmin"] },
    // ],
    // roleModels: [{ type: Schema.Types.ObjectId }],
    password: { type: String, required: true },
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

//This is some middleware intercpeting before a password is saved
userSchema.pre("save", async function (next) {
  if (this.roleCustomer === null) {
    console.log("roleCustomer Missing or null");
    try {
      const newCustomer = new Customer({
        user: this._id,
        ndisNumber: process.env.TESTING
          ? generateRandom10DigitNumber()
          : "52525242",
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
      const newProvider = new Provider({
        user: this._id,
        abn: process.env.TESTING
          ? require("../utils/helpers").generateRandom10DigitNumber()
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
