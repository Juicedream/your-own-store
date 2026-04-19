const {
  BACKEND_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = require("../config/envConfig");
const sendMail = require("../config/mailConfig");
const { UserActionQuery } = require("../db/dbQuery");
const { BadRequestError, NotFoundError } = require("../middlewares/errors");
const { verifyEmailTemplate } = require("../utils/mailTemplates");
const { errorMessages, mailSubjects } = require("../utils/messages");
const MailService = require("./mail.service");
const PasswordEncryption = require("../config/encryptions/passwordEncryption");
const { generateOtpCode } = require("../utils/verification");
const JwtService = require("./jwt.service");
const { userLoginResponse } = require("../middlewares/success");


class AuthService {
  // Register user
  static async register(data) {
    const { name, email, password } = data;
    // Check if email already exists
    const checkExistingUser = await UserActionQuery.findUser(email, "email");
    if (checkExistingUser) {
      throw new BadRequestError(`User ${errorMessages.ALREADY_EXISTS}`);
    }
    // Encrypt password
    const hashedPassword = await PasswordEncryption.hashPassword(password);
    // create and save user to db
    const registeredUser = await UserActionQuery.createAndSaveUserToDB(
      name,
      hashedPassword,
      email,
    );
    // send mail for verification link
    await MailService.sendVerificationLinkEmail(
      email,
      name,
      registeredUser.verificationID,
    );

    return registeredUser;
    // done
  }
  // Login user
  static async login(data) {
    const { email, password } = data;
    // check if user exists with the email
    const user = await UserActionQuery.findUser(email, "email");
    // if user doesn't exist
    if (!user) {
      throw new NotFoundError(`${errorMessages.INVALID_CREDENTIALS}`);
    }
    // check password is a match
    const isPasswordMatch = await PasswordEncryption.comparePasswords(
      password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new NotFoundError(`${errorMessages.INVALID_CREDENTIALS}`);
    }
    // if user is not verified and there is vID
    if (!user.isVerified && !user.verificationID) {
      const authenticatedUser =
        await UserActionQuery.createVerificationIdAndSaveToDB(user);
      await MailService.sendVerificationLinkEmail(
        authenticatedUser.email,
        authenticatedUser.name,
        authenticatedUser.verificationID,
      );
      throw new BadRequestError(errorMessages.NOT_VERIFIED_STILL);
    }
    if (!user.isVerified && user.verificationID) {
      throw new BadRequestError(errorMessages.NOT_VERIFIED);
    }
    if (!user.isVerified || user.verificationID) {
      throw new BadRequestError(errorMessages.NOT_VERIFIED);
    }
    user.password = "\*****";
    // generate jwt Token
    const token = await JwtService.generateJwtToken({
      id: user._id,
      role: user.role,
    });
    return { user, token };
  }

  // Passwordless login
  static async passwordlessLogin(data) {
    const { email } = data;
    const user = await UserActionQuery.findUser(email, "email");
    if (!user) return;
    if (user.otpCode) {
      throw new BadRequestError(errorMessages.OTP_EXIST);
    }
    // generate otp code
    const otpCode = generateOtpCode();
    const savedUser = await UserActionQuery.saveOtpCodeAndSaveToDB(
      user._id,
      otpCode,
    );
    // send otp mail
    await MailService.sendOtpCodeEmail(email, otpCode);
    return;
  }

  // Verify email
  static async verifyAccountWithVID(verifyID) {
    // Get user with verifyID
    const user = await UserActionQuery.findUser(verifyID, "verificationID");
    if (!user || user.isVerified) {
      throw new BadRequestError(errorMessages.INVALID_VERIFY_LINK);
    }
    const updatedUser = await UserActionQuery.updateVerifyIDAndSaveToDB(
      user._id,
    );
    // generate jwt Token
    const token = await JwtService.generateJwtToken({
      id: user._id,
      role: user.role,
    });
    return token;
  }
  // Verify otp code
  static async verifyOtpCode(otpCode, email) {
    const user = await UserActionQuery.findUser(email, "email");
    if (!user || !user.otpCode || otpCode !== user.otpCode) {
      throw new BadRequestError(errorMessages.INVALID_OTP_CODE);
    }
    const savedUser = await UserActionQuery.saveOtpCodeAndSaveToDB(user._id); // turns otpCode to "" and saves in user Collection;
    // generate jwt Token
    const token = await JwtService.generateJwtToken({
      id: user._id,
      role: user.role,
    });
    return { user: savedUser, token };
  }
  static async signInWithGoogle(issuer, profile, cb) {
    // Get user profile info
    const email = profile.emails[0].value;
    const name = profile.displayName;
    
    // create user in our database
    const existingUser = await UserActionQuery.findUser(email, "email");
    if (existingUser) {
      const updatedUser = await UserActionQuery.updateUser(existingUser._id, "authType", "google");
      profile.userId = existingUser._id;
      return cb(null, profile)
    }
    const newUser = await UserActionQuery.createAndSaveUserToDB(name, null, email, "google");
    profile.userId = newUser._id;
    // End
    return cb(null, profile);
  }
  static async googleSignIn(id){
    const user = await UserActionQuery.findUser(id, "id");
    if (!user || user.authType != "google") {
      throw new BadRequestError("ID: " + id + " - " + errorMessages.USER_NOT_FOUND + " on google service");
    }
    const token = await JwtService.generateJwtToken({ id, role: user.role });
    return { token, user };
  }
}

module.exports = {AuthService};
