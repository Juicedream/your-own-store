const OtpCodeModel = require("../schemas/otpCode.schema");
const SessionsModel = require("../schemas/session.schema");
const UserModel = require("../schemas/user.schema");
const VerificationIdModel = require("../schemas/verificationId.schema");
const { generateVerificationID } = require("../utils/verification");

class UserActionQuery {
  /**
   * Short description of what the function does.
   * @param {string} value - The value you want to find user by
   * @param {string} by - The element you want to find user by e.g email, verficationID, id
   * @returns {object} {_id: "137dojd2", name: "Ade", ...}
   */
  static async findUser(value, by = "email", session = null) {
    // Ensure that value is exactly the property in the user model
    let user;
    if (by === "email") {
      user = await UserModel.findOne({ email: value }).session(session);
    }
    if (by === "id") {
      user = await UserModel.findById(value).session(session);
    }
    if (!user) {
      return null;
    }

    return user ? user._doc : user;
  }

  static async updateUser(id, fieldToUpdate, newValue, session = null) {
    // const user = await UserModel.findById(id);
    const allowedFields = [
      "name",
      "email",
      "password",
      "authType",
      "otpCode",
      "isVerified",
      "role",
    ];
    if (!allowedFields.includes(fieldToUpdate)) {
      return { error: "Invalid Field update attempt" };
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { [fieldToUpdate]: newValue },
      { returnDocument: "after", runValidators: true },
      { session },
    );

    if (updatedUser) updatedUser.password = null;

    return { user: updatedUser._doc };
  }

  static async createAndSaveUserToDB(
    name,
    hashedPassword,
    email,
    authType,
    session = null,
  ) {
    // Create User
    const newUser = await UserModel.create(
      [
        {
          name,
          email,
          isVerified: authType === "google" ? true : false,
          password: hashedPassword ? hashedPassword : null,
          role: "user",
          authType: authType ? authType : "manual",
        },
      ],
      { session },
    );
    // generate the verfication ID
    if (hashedPassword && newUser[0].authType === "manual") {
      const vId = generateVerificationID(newUser[0]._id);
      const verificationID = await VerificationIdModel.create(
        [
          {
            userId: newUser[0]._id,
            verificationID: vId,
          },
        ],
        { session },
      );
      return { verificationID: vId, user: newUser[0] };
    }
    // else return user
    return { user: newUser[0] };
  }

  static async getOtpForUser(id, session = null) {
    const code = await OtpCodeModel.findOne({ userId: id }).session(session);
    if (!code || !code.otpCode) {
      return null;
    }
    return { otp: code.otpCode };
  }
  static async verifyAndUpdateOtpCode(id, otpCode = "", session = null) {
    const getOtpExist = await OtpCodeModel.findOne({ userId: id }).session(
      session,
    );
    if (!getOtpExist || otpCode !== getOtpExist.otpCode) {
      return null;
    }
    await OtpCodeModel.findByIdAndDelete(getOtpExist._id).session(session);
    return { message: "Otp deleted successfully" };
  }

  static async saveOtpCodeAndSaveToDB(id, otpCode = "", session = null) {
    // const otpExist = await OtpCodeModel.findOne({ userId: id });
    // if (otpExist) {
    //   return null;
    // }
    const saveOtp = await OtpCodeModel.create(
      [
        {
          userId: id,
          otpCode,
        },
      ],
      { session },
    );

    return saveOtp[0];
  }

  static async getVerificationIdForUser(value, by = "id", session = null) {
    if (by === "id") {
      const vId = await VerificationIdModel.findOne({ userId: value }).session(
        session,
      );
      if (!vId || !vId.verificationID) return null;
      return { vid: vId.verificationID, _id: vId._id };
    }
    if (by === "verificationID") {
      const vId = await VerificationIdModel.findOne({
        verificationID: value,
      }).session(session);
      if (!vId || !vId.userId) return null;
      return { vid: vId.verificationID, userId: vId.userId, _id: vId._id };
    }
  }

  static async updateVerifyIDAndSaveToDB(
    id,
    verificationID = "",
    session = null,
  ) {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        isVerified: verificationID ? false : true,
      },
      { returnDocument: "after", runValidators: true },
      { session },
    );
    const vid = await this.getVerificationIdForUser(id, "id", session);
    await VerificationIdModel.findByIdAndDelete(vid._id).session(session);
    updatedUser.password = null;
    return updatedUser;
  }

  static async createVerificationIdAndSaveToDB(user, session = null) {
    const vID = await VerificationIdModel.findOne({ userId: user._id }).session(
      session,
    );
    if (!vID) {
      const id = await VerificationIdModel.create(
        [
          {
            userId: user._id,
            verificationID: generateVerificationID(user._id),
          },
        ],
        { session },
      );

      return { verificationID: id[0].verificationID };
    }
    return null;
  }
  static async createNewRefreshToken(
    hashedRefreshToken,
    userId,
    session = null,
  ) {
    const existingRefreshToken = await SessionsModel.findOne({
      userId,
    }).session(session);
    if (existingRefreshToken) {
      await SessionsModel.findByIdAndDelete(existingRefreshToken._id).session(
        session,
      );
    }
    const newRefresh = await SessionsModel.create(
      [{ userRefreshToken: hashedRefreshToken, userId }],
      { session },
    );
    if (!newRefresh[0]) {
      return { error: "Couldn't not create a new refresh token" };
    }
    return { refreshToken: newRefresh[0].userRefreshToken };
  }
  static async getUserRefreshToken(userId, session = null) {
    const existingRefreshToken = await SessionsModel.findOne({
      userId,
    }).session(session);
    if (!existingRefreshToken) {
      return {
        error:
          "Error getting the refresh token for the user - No refresh token found ",
      };
    }
    return { refreshToken: existingRefreshToken.userRefreshToken };
  }
  static async deleteUserRefreshTokenSession(userId, session = null) {
    const data = await SessionsModel.findOne({ userId }).session(session);
    if (!data) {
      return { deleted: false }
    }
    // delete session
    await SessionsModel.findByIdAndDelete(data._id).session(session);
    return { deleted: true }
  }
}

module.exports = {
  UserActionQuery,
};
