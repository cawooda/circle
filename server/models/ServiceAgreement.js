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
      ref: "provider",
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "customer",
      required: false,
    },
    startDate: { type: Date },
    endDate: { type: Date },
    customerSignature: { type: String, default: null }, // Store the path to the image file
    providerSignature: { type: String, default: null }, // Store the path to the image file
    service: {
      type: Schema.Types.ObjectId,
      ref: "service",
    },
    quantity: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    approvedByCustomer: { type: Boolean, default: false },
    agreementPath: String,
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

// Pre-save hook to calculate total price
serviceAgreementSchema.pre("save", async function (next) {
  const serviceAgreement = this;
  serviceAgreement.populate("service");
  setTimeout(() => {
    this.agreementNumber = "expired";
  }, 30 * 60 * 1000);
  //expecting to set the time to expire in 30 minutes
  serviceAgreement.totalPrice = this.service.price * this.quantity;
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
