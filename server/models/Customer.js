// Import the Schema and model from mongoose.
const { Schema, model } = require("mongoose");
const { generateRandomNumber } = require("../utils/helpers");

// Define the Customer schema
const customerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
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
    referenceName: { type: String, required: true, default: "NDIS Number" },
    address: {
      street: { type: String, required: true, default: "123 Default St" },
      city: { type: String, required: true, default: "Default City" },
      state: { type: String, required: true, default: "Default State" },
      postalCode: { type: String, required: true, default: "00000" },
    },
    dateOfBirth: { type: Date, required: true, default: "1999-07-07" },
    customerSpecificField: { type: String },
    serviceAgreements: [{ type: Schema.Types.ObjectId, ref: "agreement" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // This will automatically manage createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Customer = model("customer", customerSchema);

module.exports = Customer;
