//import the Schema and model from mongoose.
const { Schema, model } = require("mongoose");

//definde the user model schema
const shiftSchema = new Schema(
  //first come the paths, like properties
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "customer",
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: "provider",
    },
    start_time: Date,
    end_time: Date,
    service: { type: Schema.Types.ObjectId, ref: "service" },
    units: Schema.Types.Decimal128,
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

shiftSchema.virtual("totalHours").get(function () {
  if (this.start_time && this.end_time) {
    const durationInMilliseconds = this.end_time - this.start_time;
    const durationInHours = durationInMilliseconds / (1000 * 60 * 60);
    return durationInHours;
  } else return false;
});

shiftSchema.virtual("totalUnits").get(function () {
  const durationInMilliseconds = this.end_time - this.start_time;
  const durationInHours = durationInMilliseconds / (1000 * 60 * 60);
});

shiftSchema.pre("save", function (next) {
  if (!this.created) this.created = new Date();
  next();
});

//initialise User Model. creates a collection called user based on the defined user schema
const Shift = model("shift", shiftSchema);

module.exports = Shift;
