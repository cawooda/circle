//A service is a combination of a product and a custom price set by the provider.

const { Schema, model } = require("mongoose");

const serviceSchema = new Schema(
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
  },
  {
    timestamps: true, // This will automatically manage createdAt and updatedAt fields
    toJSON: {
      virtuals: true,
    },
    id: false,
  },
);

serviceSchema.pre("save", function (next) {
  if (!this.createdAt) this.createdAt = new Date();
  next();
});

//initialise User Model. creates a collection called user based on the defined user schema
const Service = model("service", serviceSchema);

module.exports = Service;
