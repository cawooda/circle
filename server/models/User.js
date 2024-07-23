require("dotenv").config();
const bcrypt = require("bcrypt");
//import the Schema and model from mongoose.
const { Schema, model } = require("mongoose");

const validator = require("validator"); //this package provides a range of validator checks including email.
const jwt = require("jsonwebtoken");
const SALT_WORK_FACTOR = 10;

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
    },
    email: {
      type: String,
      unique: true,
      toLowerCase: true,
      validate: {
        validator: validator.isEmail,
        message: "email did not pass validation",
      },
    },
    token: String,
    roles: [
      { type: String, enum: ["Customer", "Provider", "Admin", "SuperAdmin"] },
    ],
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

// Pre-save hook to check for invalid role combinations, which are currently Admin+Customer
userSchema.pre("save", function (next) {
  const user = this;
  if (user.roles.includes("Customer") && user.roles.includes("Admin")) {
    return next(new Error("A user cannot be both a Customer and an Admin."));
  }
  next();
});

//This is some middleware intercpeting before a password is saved
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const saltRounds = SALT_WORK_FACTOR;
      const salt = await bcrypt.genSalt(saltRounds);
      this.password = await bcrypt.hash(this.password, salt);
      this.generateAuthToken();
    } catch (error) {
      console.error(error);
    }
    next();
  }
});

userSchema.methods.isCorrectPassword = async function (password) {
  if (await bcrypt.compare(password, this.password)) {
    this.generateAuthToken();
  }

  return bcrypt.compare(password, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
  //structure the object for signing
  const authenticatedPerson = this.toObject();
  const user = { authenticatedPerson };
  //sign the token
  const token = jwt.sign(user, process.env.SECRET_KEY, {
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  });
  this.token = token;
  return token;
};

// Sanitize inputs
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
