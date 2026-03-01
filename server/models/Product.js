const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true }, //this is the maximum price which caps the price that the user can set for their service
  },
  {
    timestamps: true, // This will automatically manage createdAt and updatedAt fields
    toJSON: {
      virtuals: true,
    },
    id: false,
  },
);

const Product = model("product", productSchema);

module.exports = Product;
