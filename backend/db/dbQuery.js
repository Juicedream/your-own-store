const UserModel = require("../schemas/user.schema");
const { generateVerificationID } = require("../utils/verification");

class UserActionQuery {
  static async findUser(value, by = "email") {
    // Ensure that value is exactly the property in the user model
    let user;
    if (by === "email") {
      user = await UserModel.findOne({ email: value });
    }
    if (by === "verificationID") {
      user = await UserModel.findOne({ verificationID: value });
    }
    // if (by === "otpCode") {
    //   user = await UserModel.findOne({ otpCode: value });
    // }

    return user ? user._doc : user;
  }

  static async createAndSaveUserToDB(name, hashedPassword, email) {
    // generate the verfication ID
    // Create User
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });
    newUser.verificationID = generateVerificationID(newUser._id);
    await newUser.save();
    return newUser._doc;
  }

  static async saveOtpCodeAndSaveToDB(id, otpCode = "") {
    const savedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        otpCode: otpCode ? otpCode : "",
      },
      { returnDocument: "after", runValidators: true },
    );
    savedUser.password = null;
    return savedUser._doc;
  }

  static async updateVerifyIDAndSaveToDB(id, verificationID = "") {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        isVerified: verificationID ? false : true,
        verificationID: verificationID ? verificationID : "",
      },
      { returnDocument: "after", runValidators: true },
    );
    // const updatedUser = await UserModel.findById(savedUser._id);
    updatedUser.password = null;

    return updatedUser._doc;
  }

  static async createVerificationIdAndSaveToDB(user) {
    const unauthenticatedUser = await UserModel.findById(user._id);
    unauthenticatedUser.verificationID = generateVerificationID(
      unauthenticatedUser._id,
    );
    await unauthenticatedUser.save();
    return unauthenticatedUser._doc;
  }
}

module.exports = {
  UserActionQuery,
};
