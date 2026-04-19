const mongoose = require("mongoose");

const otpCodeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otpCode: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Number,
    default: 5,
  }
}, {timestamps: true})

otpCodeSchema.index({createdAt: 1},{expireAfterSeconds: 300});

const OtpCodeModel = mongoose.model("OtpCode", otpCodeSchema);
module.exports = OtpCodeModel;