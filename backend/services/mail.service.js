const { BACKEND_URL } = require("../config/envConfig");
const sendMail = require("../config/mailConfig");
const { BadRequestError } = require("../middlewares/errors");
const { verifyEmailTemplate, otpMailTemplate } = require("../utils/mailTemplates");
const { mailSubjects, errorMessages } = require("../utils/messages");

class MailService {
  static async sendVerificationLinkEmail(emailTo, name, vID) {
    if (!vID) {
      throw new BadRequestError(errorMessages.VERFICATION_ID_UNDEFINED);
    }
    const verificationLink = `${BACKEND_URL}/auth/verify-email/${vID}`;
    sendMail(
      emailTo,
      mailSubjects.VERIFY_EMAIL,
      verifyEmailTemplate(name, verificationLink),
    );
  }
  static async sendOtpCodeEmail(emailTo, otpCode) {
    if (!otpCode) {
      throw new BadRequestError("Could not send otpCode at the moment");
    }
    sendMail(
      emailTo,
      mailSubjects.PASSWORDLESS_LOGIN_OTP_CODE,
      otpMailTemplate(otpCode),
    );
  }
}

module.exports = MailService