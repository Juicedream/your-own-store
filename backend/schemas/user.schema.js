const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: { type: String, unique: true },
    password: { type: String, default: null },
    authType: {
      type: String,
      enum: ["manual", "google"],
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders",
      },
    ],
    otpCode: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationID: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ["superAdmin", "admin", "user"],
    },
  },
  { timestamps: true },
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
