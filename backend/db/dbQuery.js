const {
  hashPassword,
  comparePasswords,
} = require("../config/encryptions/passwordEncryption");
const { BACKEND_URL } = require("../config/envConfig");
const sendMail = require("../config/mailConfig");
const {
  InternalServerError,
  BadRequestError,
  NotFoundError,
} = require("../middlewares/errors");
const UserModel = require("../schemas/user.schema");
const { otpMailTemplate, verifyEmailTemplate } = require("../utils/mailTemplates");
const { errorMessages, mailSubjects } = require("../utils/messages");
const {generateVerificationID, generateOtpCode} = require("../utils/verification");

class UserActionQuery {
  static async createUser(data) {
    const { name, email, password } = data;
    // Check if email already exists
    const checkExistingUser = await this.findUser(email);
    if (checkExistingUser) {
      throw new BadRequestError(`User ${errorMessages.ALREADY_EXISTS}`);
    }
    // Encrypt password
    const hashedPassword = await hashPassword(password);
    // create and save user to db
    await this.saveUserToDB(name, hashedPassword, email);
  }
  static async loginUser(data) {
    const { email, password } = data;
    // check if user exists with the email
    const user = await this.checkExistingUser("login", email);
    // check password
    const isPasswordMatch = await this.matchPasswords(password, user.password);
    // if user is not verified and there is vID
    if (!user.isVerified && !user.verificationID) {
      await this.generateVerificationLink(user);
      throw new BadRequestError(errorMessages.NOT_VERIFIED_STILL);
    }
    if (!user.isVerified && user.verificationID) {
      throw new BadRequestError(errorMessages.NOT_VERIFIED);
    }
    if (!user.isVerified || user.verificationID) {
      throw new BadRequestError(errorMessages.NOT_VERIFIED);
    }
    user.password = "\*****";
    return user;
  }

  static async findUser(value, by="email") {
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

  static async saveUserToDB(name, hashedPassword, email) {
    // Create User
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });
    const vID = generateVerificationID(newUser._id);
    newUser.verificationID = vID;
    await newUser.save();
    const verificationLink = `${BACKEND_URL}/auth/verify-email/${vID}`;
    await sendMail(email, mailSubjects.VERIFY_EMAIL, verifyEmailTemplate(name, verificationLink));
    return newUser;
  }

  static async checkExistingUser(type = "register", email) {
    const user = await this.findUser(email, "email");
    if (type === "login" && !user) {
      throw new NotFoundError(`${errorMessages.INVALID_CREDENTIALS}`);
    }
  
    return user;
  }

  static async matchPasswords(password, hashPassword) {
    const passwordsMatch = await comparePasswords(password, hashPassword);

    if (!passwordsMatch) {
      throw new NotFoundError(`${errorMessages.INVALID_CREDENTIALS}`);
    }
    return passwordsMatch;
  }

  static async verifyAccountWithVID(vID) {
    let verificationID = vID;
    const user = await this.findUser(verificationID, "verificationID");
    
    if (!user || user.isVerified) {
      throw new BadRequestError(errorMessages.INVALID_VERIFY_LINK);
    }

    const savedUser = await UserModel.findByIdAndUpdate(user._id, { isVerified: true, verificationID: "" } );

    await savedUser.save();

    const updatedUser = await UserModel.findById(savedUser._id);

    updatedUser.password = null;

    return updatedUser._doc;
  }

  static async generateVerificationLink(user) {
    const unauthenticatedUser = await UserModel.findById(user._id);
    unauthenticatedUser.verificationID = generateVerificationID(unauthenticatedUser._id);
    await unauthenticatedUser.save();
  }

  static async passwordlessLogin(data) {
    const {email} = data;
    const user = await this.findUser(email, "email");
    if (!user)  return;
    if (user.otpCode){
      throw new BadRequestError(errorMessages.OTP_EXIST);
    }
    const otpCode = generateOtpCode()
    const savedUser = await UserModel.findByIdAndUpdate(user._id, { otpCode });
    await sendMail(savedUser.email, mailSubjects.PASSWORDLESS_LOGIN_OTP_CODE, otpMailTemplate(otpCode));
    return;
  }

  static async verifyOtpCode(otpCode, email) {
    const user = await this.findUser(email, "email");
    if (!user || !user.otpCode || otpCode !== user.otpCode) {
      throw new BadRequestError(errorMessages.INVALID_OTP_CODE);
    }
    const savedUser = await UserModel.findByIdAndUpdate(user._id, { otpCode: "" } );

    await savedUser.save();

    const updatedUser = await UserModel.findById(savedUser._id);

    updatedUser.password = null;

    return updatedUser._doc; 
  }
}

module.exports = {
  UserActionQuery,
};
