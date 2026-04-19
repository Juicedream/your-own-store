const UserModel = require("../schemas/user.schema");
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
    if (by === "verificationID") {
      user = await UserModel.findOne({ verificationID: value });
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
        password: properyToUpdate === "password" ? newValue: user.password,
        authType: properyToUpdate === "authType" ? newValue : user.authType,
        otpCode: properyToUpdate === "otpCode" ? newValue : user.otpCode,
        isVerified: properyToUpdate === "isVerified" ? newValue : user.isVerified,
        verificationID: properyToUpdate === "verificationID" ? newValue : user.verificationID,
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
      newUser.verificationID = generateVerificationID(newUser._id);
    }
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
