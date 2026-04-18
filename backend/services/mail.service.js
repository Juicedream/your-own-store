const { BACKEND_URL } = require("../config/envConfig");
const sendMail = require("../config/mailConfig");
const { verifyEmailTemplate, otpMailTemplate } = require("../utils/mailTemplates");
const { mailSubjects } = require("../utils/messages");

class MailService {
  static async sendVerificationLinkEmail(emailTo, name, vID) {
    const verificationLink = `${BACKEND_URL}/auth/verify-email/${vID}`;
    sendMail(
      emailTo,
      mailSubjects.VERIFY_EMAIL,
      verifyEmailTemplate(name, verificationLink),
    );
  }
  static async sendOtpCodeEmail(emailTo, otpCode) {
    sendMail(
      emailTo,
      mailSubjects.PASSWORDLESS_LOGIN_OTP_CODE,
      otpMailTemplate(otpCode),
    );
  }
}

module.exports = MailService