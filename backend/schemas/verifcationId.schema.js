const mongoose = require("mongoose");

const verificationIdSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  verificationID: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Number,
    default: 10,
  }
}, {timestamps: true})

verificationIdSchema.index({createdAt: 1},{expireAfterSeconds: 600});

const VerificationIdModel = mongoose.model("VerificationId", verificationIdSchema);
module.exports = VerificationIdModel;