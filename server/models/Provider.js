//import the Schema and model from mongoose.
const { Schema, model } = require("mongoose");

const providerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    abn: { type: String, required: true },
    address: { type: String, required: true },
    providerName: { type: String, required: true },
    termsAndConditions: {
      Heading: String,
      subHeading1: String,
      paragragh1: String,
      subHeading2: String,
      paragragh2: String,
      subHeading3: String,
      paragragh3: String,
      subHeading4: String,
      paragragh4: String,
      subHeading5: String,
      paragragh5: String,
      subHeading6: String,
      paragragh6: String,
    },
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

const Provider = model("Provider", providerSchema);

module.exports = Provider;
