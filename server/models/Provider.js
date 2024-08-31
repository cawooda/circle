//import the Schema and model from mongoose.
const { Schema, model } = require("mongoose");

const providerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    abn: { type: String, required: true },
    address: { type: String, required: true },
    providerName: { type: String, required: true },
    termsAndConditions: [
      {
        heading: {
          type: String,
        },
        paragraph: { type: String },
      },
    ],
    serviceAgreements: [{ type: Schema.Types.ObjectId, ref: "agreement" }],
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

const Provider = model("provider", providerSchema);

module.exports = Provider;
