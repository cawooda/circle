//import the Schema and model from mongoose.
const { Schema, model } = require("mongoose");

//definde the user model schema
const customerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    invoiceEmail: {
      type: String,
      required: true,
      default: "hello@circleindependent.com",
    },
    serviceAgreementEmail: {
      type: String,
      required: true,
      default: "hello@circleindependent.com",
    },
    ndisNumber: { type: String, required: true },
    address: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    customerSpecificField: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  }
);

const Customer = model("customer", customerSchema);

module.exports = Customer;
