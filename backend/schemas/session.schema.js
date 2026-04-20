const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    userRefreshToken: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true },
);

const SessionsModel = mongoose.model("Sessions", sessionSchema);
module.exports = SessionsModel;