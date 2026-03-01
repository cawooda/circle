//import the Schema and model from mongoose.
const { Schema, model, SchemaType } = require("mongoose");
const Service = require("./Service");
//service agreement needs a status and this status is updated whenever a change occurs to the agreement, such as a change to the expiresAt field or an update to the agreement that would trigger the pre-save hook to run again and recalculate the expiresAt field. The status is determined by comparing the current date to the expiresAt date. If the current date is past the expiresAt date, the status should be "expired". If the current date is before the expiresAt date, the status should be "active". If the agreement has been terminated by either party, the status should be "terminated". The status field should be updated automatically whenever there is a change to the agreement that could affect its validity or expiration.
const STATUS = ["active", "expired", "terminated"];

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
    expiresAt: {
      type: Date,
      required: true,
      validate: {
        validator: (v) => v instanceof Date && !isNaN(v.valueOf()),
        message: "expiresAt must be a valid date",
      },
    },
    status: {
      type: String,
      enum: STATUS,
      default: "active",
      required: true,
    },
  },
  {
    timestamps: true, // This will automatically manage createdAt and updatedAt fields
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  },
);

// Pre-save hook to calculate total price
serviceAgreementSchema.pre("validate", async function (next) {
  console.log("this.service", this.service);
  const serviceId = this.service?._id || this.service;
  const serviceDoc = await Service.findById(serviceId).select("price").lean();
  this.totalPrice = (serviceDoc?.price ?? 0) * (this.quantity ?? 0);
  this.expiresAt = new Date(this.createdAt || new Date() + 30 * 60 * 1000); // Set expiresAt to 30 minutes after createdAt
  this.status = computeStatus(this.expiresAt);
  next();
});

serviceAgreementSchema.pre("findOneAndUpdate", syncStatusInUpdate);
serviceAgreementSchema.pre("updateOne", syncStatusInUpdate);
serviceAgreementSchema.pre("updateMany", syncStatusInUpdate);

// Method to send approval link to customer
serviceAgreementSchema.methods.sendApprovalLink = function (callback) {
  // Logic to send the link to the customer via email or SMS
  // This can include generating a unique token or URL for the customer to approve the agreement
  callback();
};

//initialise User Model. creates a collection called user based on the defined user schema
const ServiceAgreement = model("agreement", serviceAgreementSchema);

module.exports = ServiceAgreement;

function computeStatus(expiresAt) {
  const now = new Date();
  if (expiresAt < now) {
    return "expired";
  }
  return "active";
}

function syncStatusInUpdate(next) {
  const update = this.getUpdate() || {};
  const $set = update.$set || {};
  const expiresAt = $set.expiresAt ?? update.expiresAt;
  const status = $set.status ?? update.status;

  // If expiresAt/status aren't being touched, don't guess—leave it alone.
  // But if expiresAt is being updated, we should update status too.
  if (expiresAt) {
    const newStatus = computeStatus(expiresAt);
    this.setUpdate({
      ...update,
      $set: { ...$set, status: newStatus, expiresAt },
    });
  }
}
