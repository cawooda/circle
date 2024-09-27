//import the Schema and model from mongoose
//A service is a combination of a product and a custom price set by the provider.

const { Schema, model } = require("mongoose");

//definde the user model schema
const serviceSchema = new Schema(
  //first come the paths, like properties
  {
    provider: {
      type: Schema.Types.ObjectId,
      ref: "provider",
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
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

serviceSchema.index({ provider: 1, product: 1 }, { unique: true });

serviceSchema.pre("save", function (next) {
  if (!this.created) this.created = new Date();
  next();
});

//initialise User Model. creates a collection called user based on the defined user schema
const Service = model("service", serviceSchema);

module.exports = Service;
