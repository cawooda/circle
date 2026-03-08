const { Schema, model, Types } = require("mongoose");
const { defaultTermsAndConditions } = require("../seeders/seedData");

const { generateRandomNumber } = require("../utils/helpers");

const providerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
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
  {
    timestamps: true, // This will automatically manage createdAt and updatedAt fields
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  },
);

providerSchema.pre("save", async function (next) {
  try {
    // Add default terms and conditions only if it's not already provided
    if (!this.termsAndConditions || this.termsAndConditions.length === 0) {
      this.termsAndConditions = defaultTermsAndConditions.map((term) => ({
        ...term,
      }));
    }
    next();
  } catch (error) {
    console.error("Error while setting up default terms and conditions", error);
    next(error);
  }
});

const Provider = model("provider", providerSchema);

module.exports = Provider;
