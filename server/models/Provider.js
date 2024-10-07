const { Schema, model, Types } = require("mongoose");
const { defaultTermsAndConditions } = require("../seeders/seedData");

const { generateRandomNumber } = require("../utils/helpers");

const providerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    abn: {
      type: String,
      required: true,
      default: generateRandomNumber(1000000000, 9999999999),
    },
    address: {
      street: { type: String, required: true, default: "123 Default St" },
      city: { type: String, required: true, default: "Default City" },
      state: { type: String, required: true, default: "Default State" },
      postalCode: { type: String, required: true, default: "00000" },
    },
    providerName: { type: String, required: true, default: "Acme Electronics" },
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
        default: ["66d6b24c6bea26447abaeaf9"],
      },
    ],
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: "service",
        default: [
          new Types.ObjectId("66a0d9f4a0eb8627cc6320f9"),
          new Types.ObjectId("66a0d9f4a0eb8627cc6321f0"),
        ],
      },
    ],
    serviceAgreements: [{ type: Schema.Types.ObjectId, ref: "agreement" }],
    shifts: [{ type: Schema.Types.ObjectId, ref: "shift" }],
    logoUrl: String,
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

providerSchema.pre("findOneAndRemove", async function (next) {
  try {
    const userId = this.user;
    const user = await User.findById(userId);
    user.roleProvider = null;
    await user.save();
    next();
  } catch (error) {
    console.error("Error while deleting provider", error);
    next();
  }
});
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
