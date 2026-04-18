const successMessages = {
  PRODUCT_CREATED: "Product created successfully",
  USER_REGISTERED: "User registered Sucessfully",
  LOGIN: "User logged in",
  LOGOUT: "User logged out",
  VERIFY_EMAIL: "Check your email inbox for verification link",
  OTP_CODE_SENT: "If the email you provided is in our system, An OTP Code will sent"
}


const errorMessages = {
  INVALID_CREDENTIALS: "You have provided Invalid Credentials",
  NOT_FOUND: "This resource is not found",
  USER_NOT_FOUND: "User Not Found",
  SERVER_ERROR: "Internal Server Error, Please try again later",
  ALREADY_EXISTS: "Already Exists",
  NOT_VERIFIED: "Check your email inbox for a verification link",
  NOT_VERIFIED_STILL: "A new verification link has been sent to your mail",
  INVALID_VERIFY_LINK: "This link is invalid or expired",
  INVALID_OTP_CODE: "This otp code is invalid or expired",
  OTP_EXIST: "Kindly use the otp previously sent to your email",
}

const mailSubjects = {
  PASSWORDLESS_LOGIN_OTP_CODE: "Password login Otp Code",
  VERIFY_EMAIL: "Your Own Store - Verify your Email",
}

module.exports = { successMessages, errorMessages, mailSubjects}