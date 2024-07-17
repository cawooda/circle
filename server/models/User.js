const bcrypt = require("bcrypt");
//import the Schema and model from mongoose.
const { Schema, model } = require("mongoose");
const { Admin } = require("../models/Admin");
const { Business } = require("../models/Admin");
const { Customer } = require("../models/Admin");
const { validateEmail } = require("../utils/helpers");

//definde the user model schema
const userSchema = new Schema(
  //first come the paths, like properties
  {
    first: String,
    last: String,
    date_of_birth: Date,
    mobile: {
      type: String,
      minLength: 10,
      maxLength: 10,
    },
    email: {
      type: String,
      toLowerCase: true,
      validate: {
        validator: validateEmail,
        message: "email did not pass validation",
      },
    },
    password: String,
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
    id: false,
  }
);

userSchema
  .virtual("isAdmin")
  .get(function () {
    try {
      const admin = Admin.findOne({ userId: this._id });
      if (admin) {
        return true;
      }
    } catch (err) {
      console.log(err);
    }
  })
  .set(function () {
    //toggles value of admin
    try {
      let admin = Admin.findOne({ userId: this._id });
      if (!admin) {
        let admin = Admin.create({ userId: this._id });
      } else {
        admin.deleteOne({ userId: this._id }).save();
      }
    } catch (err) {
      console.log(err);
    }
  });

userSchema
  .virtual("isCustomer")
  .get(function () {
    try {
      const customer = Customer.findOne({ userId: this._id });
      if (customer) {
        return true;
      }
    } catch (err) {
      console.log(err);
    }
  })
  .set(function () {
    //toggles value of customer
    try {
      let customer = Customer.findOne({ userId: this._id });
      if (!customer) {
        let customer = Customer.create({ userId: this._id });
      } else {
        customer.deleteOne({ userId: this._id }).save();
      }
    } catch (err) {
      console.log(err);
    }
  });

userSchema
  .virtual("isBusiness")
  .get(function () {
    try {
      const business = Business.findOne({ userId: this._id });
      if (business) {
        return true;
      }
    } catch (err) {
      console.log(err);
    }
  })
  .set(function () {
    //toggles value of business
    try {
      let business = Business.findOne({ userId: this._id });
      if (!business) {
        let business = Business.create({ userId: this._id });
      } else {
        business.deleteOne({ userId: this._id }).save();
      }
    } catch (err) {
      console.log(err);
    }
  });

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
    // I thinmk this next line sets the values for furst and last name in the document
    this.set({ first, last });
  });

//This is some middleware intercpeting before a password is saved
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      console.error(error);
    }
    next();
  }
});

//initialise User Model. creates a collection called user based on the defined user schema
const User = model("user", userSchema);

module.exports = User;
