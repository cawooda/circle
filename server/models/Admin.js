//import the Schema and model from mongoose.
const { Schema, model } = require("mongoose");
const User = require("./UserOLD");

//definde the user model schema
const adminSchema = new Schema(
  //first come the paths, like properties
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      unique: true,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
        default: [],
      },
    ],
  },
  {
    timestamps: true, // This will automatically manage createdAt and updatedAt fields
    toJSON: {
      virtuals: true,
    },
    id: false,
  },
);

adminSchema.pre("save", async function (next) {
  const allUsers = await User.find({}, "_id").exec(); //find all users and return only their _id field
  this.users = allUsers;
  next();
});

//initialise User Model. creates a collection called user based on the defined user schema
const Admin = model("admin", adminSchema);

module.exports = Admin;
