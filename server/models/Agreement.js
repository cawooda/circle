//import the Schema and model from mongoose.
const { Schema, model, SchemaType } = require("mongoose");

//definde the user model schema
const agreementSchema = new Schema(
  //first come the paths, like properties
  {
    provider: {
      type: Schema.Types.ObjectId,
      ref: "provider",
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "customer",
    },
    start_date: {
      type: Date,
      default: Date.now(),
    },
    end_date: {
      type: Date,
      default: () => this.Customer.planEndDate,
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

//initialise User Model. creates a collection called user based on the defined user schema
const Agreement = model("agreement", agreementSchema);

module.exports = Agreement;
