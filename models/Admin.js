//import the Schema and model from mongoose.
const { Schema, model } = require("mongoose");

//definde the user model schema
const adminSchema = new Schema(
  //first come the paths, like properties
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
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

//initialise User Model. creates a collection called user based on the defined user schema
const Admin = model("admin", adminSchema);

module.exports = Admin;
