const OtpCodeModel = require("../schemas/otpCode.schema");
const UserModel = require("../schemas/user.schema");
const VerificationIdModel = require("../schemas/verifcationId.schema");
const { generateVerificationID } = require("../utils/verification");

class UserActionQuery {
  /**
   * Short description of what the function does.
   * @param {string} value - The value you want to find user by
   * @param {string} by - The element you want to find user by e.g email, verficationID, id
   * @returns {object} {_id: "137dojd2", name: "Ade", ...}
   */
  static async findUser(value, by = "email") {
    // Ensure that value is exactly the property in the user model
    let user;
    if (by === "email") {
      user = await UserModel.findOne({ email: value });
    }
    if (by === "id") {
      user = await UserModel.findById(value);
    }

    return user ? user._doc : user;
  }

  static async updateUser(id, properyToUpdate, newValue) {
    const user = await UserModel.findById(id);
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        name: properyToUpdate === "name" ? newValue : user.name,
        email: properyToUpdate === "email" ? newValue : user.email,
        password: properyToUpdate === "password" ? newValue : user.password,
        authType: properyToUpdate === "authType" ? newValue : user.authType,
        otpCode: properyToUpdate === "otpCode" ? newValue : user.otpCode,
        isVerified:
          properyToUpdate === "isVerified" ? newValue : user.isVerified,
        verificationID:
          properyToUpdate === "verificationID" ? newValue : user.verificationID,
        role: properyToUpdate === "role" ? newValue : user.role,
      },
      { returnDocument: "after", runValidators: true },
    );
    updatedUser.password = null;

    return updatedUser._doc;
  }

  static async createAndSaveUserToDB(name, hashedPassword, email, authType) {
    // Create User
    const newUser = new UserModel({
      name,
      email,
      isVerified: authType === "google" ? true : false,
      password: hashedPassword ? hashedPassword : null,
      role: "user",
      authType: authType ? authType : "manual",
    });
    // generate the verfication ID
    if (hashedPassword && newUser.authType === "manual") {
      const vId = generateVerificationID(newUser._id);
      const verificationID = new VerificationIdModel({
        userId: newUser._id,
        verificationID: vId,
      });
      await verificationID.save();
      await newUser.save();
      return { verificationID: vId, user: newUser._doc };
    }
    await newUser.save();
    return { user: newUser._doc };
  }

  static async getOtpForUser(id) {
    const code = await OtpCodeModel.findOne({ userId: id });
    if (!code || !code.otpCode) {
      return null;
    }
    return { otp: code.otpCode };
  }
  static async verifyAndUpdateOtpCode(id, otpCode = "") {
    const getOtpExist = await OtpCodeModel.findOne({ userId: id });
    if (!getOtpExist || otpCode !== getOtpExist.otpCode) {
      return null;
    }
    await OtpCodeModel.findByIdAndDelete(getOtpExist._id);
    return { message: "Otp deleted successfully" };
  }

  static async saveOtpCodeAndSaveToDB(id, otpCode = "") {
    const otpExist = await OtpCodeModel.findOne({ userId: id });
    if (otpExist) {
      return null;
    }
    const saveOtp = new OtpCodeModel({
      userId: id,
      otpCode,
    });

    await saveOtp.save();

    return saveOtp._doc;
  }

  static async getVerificationIdForUser(value, by = "id") {
    if (by === "id") {
      const vId = await VerificationIdModel.findOne({ userId: value });
      if (!vId || !vId.verificationID) return null;
      return { vid: vId.verificationID, _id: vId._id };
    }
    if (by === "verificationID") {
      const vId = await VerificationIdModel.findOne({ verificationID: value });
      if (!vId || !vId.userId) return null;
      return { vid: vId.verificationID, userId: vId.userId, _id: vId._id };
    }
  }

  static async updateVerifyIDAndSaveToDB(id, verificationID = "") {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        isVerified: verificationID ? false : true,
      },
      { returnDocument: "after", runValidators: true },
    );
    const vid = await this.getVerificationIdForUser(id, "id");
    await VerificationIdModel.findByIdAndDelete(vid._id);
    updatedUser.password = null;
    return updatedUser._doc;
  }

  static async createVerificationIdAndSaveToDB(user) {
    const vID = await VerificationIdModel.findOne({ userId: user._id });
    if (!vID) {
      const id = await VerificationIdModel.create({
        userId: user._id,
        verificationID: generateVerificationID(user._id), 
      });
      await id.save();
      return { vericationID: id.verificationID };
    }
    return null;
  }
}

module.exports = {
  UserActionQuery,
};
