//import the Schema and model from mongoose.
const { Schema, model } = require("mongoose");

const providerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
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

const Provider = model("provider", providerSchema);

module.exports = Provider;
