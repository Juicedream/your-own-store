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
const { default: mongoose } = require("mongoose");

class AuthService {
  // Register user
  static async register(data) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
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
        "",
        session,
      );
      const user = registeredUser.user;
      if (!user) {
        throw new BadRequestError("Couldn't register user at the moment");
      }
      // send mail for verification link
      await MailService.sendVerificationLinkEmail(
        email,
        name,
        registeredUser.verificationID,
      );
      await session.commitTransaction();
      // done
      return registeredUser.user;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  // Login user
  static async login(data) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const { email, password } = data;
      // check if user exists with the email
      const user = await UserActionQuery.findUser(email, "email", session);
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
      const userVerificationID = await UserActionQuery.getVerificationIdForUser(
        user._id,
        "id",
        session,
      );
      // if user is not verified and there is vID
      const isUnverified = !user.isVerified;
      const hasVerification = !!userVerificationID;
      if (isUnverified) {
        if (!hasVerification) {
          const authenticatedUser =
            await UserActionQuery.createVerificationIdAndSaveToDB(
              user,
              session,
            );
          await MailService.sendVerificationLinkEmail(
            user.email,
            user.name,
            authenticatedUser.verificationID,
          );
          throw new BadRequestError(errorMessages.NOT_VERIFIED_STILL);
        }
        throw new BadRequestError(errorMessages.NOT_VERIFIED);
      }

      user.password = null;
      // generate jwt Token
      const token = await JwtService.generateJwtToken({
        id: user._id,
        role: user.role,
      });
      if (!token) {
        throw new Error("Jwt Token couldn't be generated");
      }
      const refreshToken = await JwtService.generateRefreshToken(user._id);
      if (!refreshToken) {
        throw new Error("Refresh Token couldn't be generated");
      }
      const hashedRefreshToken =
        await PasswordEncryption.hashRefreshToken(refreshToken);
      if (!hashedRefreshToken) {
        throw new Error("Refresh Token couldn't be encrypted");
      }
      const savedRefreshToken = await UserActionQuery.createNewRefreshToken(
        hashedRefreshToken,
        user._id,
        session,
      );
      if (savedRefreshToken.error) {
        throw new Error(savedRefreshToken.error);
      }
      await session.commitTransaction();
      return { user, token, refreshToken };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Passwordless login
  static async passwordlessLogin(data) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const { email } = data;
      const user = await UserActionQuery.findUser(email, "email", session);
      if (!user) return;
      const otpExist = await UserActionQuery.getOtpForUser(user._id, session);
      const otp = otpExist.otp;
      if (otp) {
        throw new BadRequestError(errorMessages.OTP_EXIST);
      }
      // generate otp code
      const otpCode = generateOtpCode();
      const savedUser = await UserActionQuery.saveOtpCodeAndSaveToDB(
        user._id,
        otpCode,
        session,
      );
      if (!savedUser) {
        throw new BadRequestError(errorMessages.OTP_EXIST);
      }
      // send otp mail
      await MailService.sendOtpCodeEmail(email, otpCode);
      await session.commitTransaction();
      return;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Verify email
  static async verifyAccountWithVID(verifyID) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      // Get user with verifyID
      const user = await UserActionQuery.getVerificationIdForUser(
        verifyID,
        "verificationID",
        session,
      );
      if (!user || !user.userId) {
        throw new BadRequestError(errorMessages.INVALID_VERIFY_LINK);
      }

      const updatedUser = await UserActionQuery.updateVerifyIDAndSaveToDB(
        user.userId,
        "",
        session,
      );
      if (!updatedUser) {
        throw new BadRequestError(
          "Could not verify account successfully at the moment.",
        );
      }
      // generate jwt Token
      const token = await JwtService.generateJwtToken({
        id: updatedUser._id,
        role: updatedUser.role,
      });
      // generate refresh token
      const refreshToken = await JwtService.generateRefreshToken(user.userId);
      if (!refreshToken) {
        throw new Error("Refresh Token couldn't be generated");
      }
      const hashedRefreshToken =
        await PasswordEncryption.hashRefreshToken(refreshToken);
      if (!hashedRefreshToken) {
        throw new Error("Refresh Token couldn't be encrypted");
      }
      const savedRefreshToken = await UserActionQuery.createNewRefreshToken(
        hashedRefreshToken,
        user.userId,
        session,
      );
      if (savedRefreshToken.error) {
        throw new Error(savedRefreshToken.error);
      }
      await session.commitTransaction();
      return { token, refreshToken };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  // Verify otp code
  static async verifyOtpCode(otpCode, email) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      const user = await UserActionQuery.findUser(email, "email", session);
      const otpExist = await UserActionQuery.verifyAndUpdateOtpCode(
        user._id,
        otpCode,
        session,
      );
      if (!user || !otpExist) {
        throw new BadRequestError(errorMessages.INVALID_OTP_CODE);
      }
      // generate jwt Token
      const token = await JwtService.generateJwtToken({
        id: user._id,
        role: user.role,
      });
      const refreshToken = await JwtService.generateRefreshToken(user._id);
      if (!refreshToken) {
        throw new Error("Refresh Token couldn't be generated");
      }
      const hashedRefreshToken =
        await PasswordEncryption.hashRefreshToken(refreshToken);
      if (!hashedRefreshToken) {
        throw new Error("Refresh Token couldn't be encrypted");
      }
      const savedRefreshToken = await UserActionQuery.createNewRefreshToken(
        hashedRefreshToken,
        user._id,
        session,
      );
      if (savedRefreshToken.error) {
        throw new Error(savedRefreshToken.error);
      }
      await session.commitTransaction();
      return { user, token, refreshToken };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
  // Sign in with google
  static async signInWithGoogle(issuer, profile, cb) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      // Get user profile info
      const email = profile.emails[0].value;
      const name = profile.displayName;

      // create user in our database
      const existingUser = await UserActionQuery.findUser(
        email,
        "email",
        session,
      );
      if (existingUser) {
        const updatedUser = await UserActionQuery.updateUser(
          existingUser._id,
          "authType",
          "google",
          session,
        );
        const error = updatedUser.error;
        if (error) {
          throw new BadRequestError(error);
        }
        profile.userId = existingUser._id;
        await session.commitTransaction();
        return cb(null, profile);
      }
      const newUser = await UserActionQuery.createAndSaveUserToDB(
        name,
        null,
        email,
        "google",
        session,
      );
      const currentUser = newUser.user;
      if (!currentUser) {
        throw new BadRequestError(
          "Could not sign in to google successfully at the moment",
        );
      }
      profile.userId = currentUser._id;
      // End
      await session.commitTransaction();
      return cb(null, profile);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
  // Google sign in success
  static async googleSignIn(id) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const user = await UserActionQuery.findUser(id, "id", session);
      if (!user || user.authType != "google") {
        throw new BadRequestError(
          "ID: " +
            id +
            " - " +
            errorMessages.USER_NOT_FOUND +
            " on google service",
        );
      }
      const token = await JwtService.generateJwtToken({ id, role: user.role });
      await session.commitTransaction();
      return { token, user };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
  // Create a new access token with refresh token
  static async newAccessToken(id, role) {
    const accessToken = await JwtService.generateJwtToken({ id, role });
    return { accessToken };
  }
  static async logout(id) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const deletedSession =
        await UserActionQuery.deleteUserRefreshTokenSession(id, session);
      if (!deletedSession.deleted) {
        throw new Error("Could not delete user refresh token");
      }
      await session.commitTransaction();
      return { deleted: true };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}

module.exports = { AuthService };
