//import the Schema and model from mongoose.
const { Schema, model, SchemaType } = require("mongoose");

const serviceAgreementSchema = new Schema(
  {
    provider: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },
    otherProvider: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: false,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    signature: { type: String, required: true }, // Store the path to the image file
    products: [
      //as an array, this contains multiple instances of the product schema.
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product", //linking to the Product object
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0 },
    approvedByCustomer: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Pre-save hook to calculate total price
serviceAgreementSchema.pre("save", async function (next) {
  const serviceAgreement = this;

  // Populate product details
  await serviceAgreement.populate("products.product").execPopulate();

  serviceAgreement.totalPrice = serviceAgreement.products.reduce(
    (total, item) => {
      return total + item.quantity * item.product.price;
    },
    0
  );

  next();
});

// Method to send approval link to customer
serviceAgreementSchema.methods.sendApprovalLink = function (callback) {
  // Logic to send the link to the customer via email or SMS
  // This can include generating a unique token or URL for the customer to approve the agreement
  callback();
};

//initialise User Model. creates a collection called user based on the defined user schema
const ServiceAgreement = model("agreement", serviceAgreementSchema);

module.exports = ServiceAgreement;
