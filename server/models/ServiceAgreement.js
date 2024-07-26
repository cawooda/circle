//import the Schema and model from mongoose.
const { Schema, model, SchemaType } = require("mongoose");
const Product = require("./Product");
const serviceAgreementSchema = new Schema(
  {
    agreementNumber: {
      type: String,
      required: true,
      default: () => {
        return Math.floor(Math.random() * 90) + 10;
      },
    },
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
    startDate: { type: Date },
    endDate: { type: Date },
    signature: { type: String, default: null }, // Store the path to the image file
    product: {
      type: Schema.Types.ObjectId,
      ref: "product", //linking to the Product object
      required: true,
    },
    quantity: { type: Number, required: true, default: 0 },
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
