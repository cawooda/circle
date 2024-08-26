//import the Schema and model from mongoose.
const { Schema, model } = require("mongoose");

//definde the user model schema
const customerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    // other fields
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Customer = model("customer", customerSchema);
module.exports = Customer;
