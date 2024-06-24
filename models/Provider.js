//import the Schema and model from mongoose.
const { Schema, model } = require("mongoose");

//definde the user model schema
const providerSchema = new Schema(
  //first come the paths, like properties
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    name: String,
    address: {
      number: String,
      street: String,
      city: String,
      postCode: String,
      country: String,
    },
    abn: String,
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
const Provider = model("provider", providerSchema);

module.exports = Provider;
