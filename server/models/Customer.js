// Import the Schema and model from mongoose.
const { Schema, model } = require("mongoose");
const { generateRandomNumber } = require("../utils/helpers");

// Define the Customer schema
const customerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    invoiceEmail: { type: String, required: true },
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
    address: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
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

// Create the Customer model
const Customer = model("customer", customerSchema);

module.exports = Customer;
