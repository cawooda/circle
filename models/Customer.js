//import the Schema and model from mongoose.
const { Schema, model } = require("mongoose");

//definde the user model schema
const customerSchema = new Schema(
  //first come the paths, like properties
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    ndis_number: {
      type: String,
      minLength: 9,
      maxLength: 9,
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
const Customer = model("customer", customerSchema);

module.exports = Customer;
