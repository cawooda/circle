//import the Schema and model from mongoose.
const { Schema, model } = require("mongoose");

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
    startTime: Date,
    end_time: Date,
    service: { type: Schema.Types.ObjectId, ref: "service" },
    units: { type: Number, required: true },
  },
  //then come the
  {
    timestamps: true, // This will automatically manage createdAt and updatedAt fields
    toJSON: {
      virtuals: true,
    },
    id: false,
  },
);

shiftSchema.virtual("totalHours").get(function () {
  if (this.startTime && this.end_time) {
    const durationInMilliseconds = this.end_time - this.startTime;
    const durationInHours = durationInMilliseconds / (1000 * 60 * 60);
    return durationInHours;
  } else return false;
});

shiftSchema.virtual("totalUnits").get(function () {
  const durationInMilliseconds = this.end_time - this.startTime;
  const durationInHours = durationInMilliseconds / (1000 * 60 * 60);
});

shiftSchema.pre("save", function (next) {
  if (!this.created) this.created = new Date();
  next();
});

//initialise User Model. creates a collection called user based on the defined user schema
const Shift = model("shift", shiftSchema);

module.exports = Shift;
