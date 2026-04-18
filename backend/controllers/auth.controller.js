const { UserActionQuery } = require("../db/dbQuery");
const { userRegisteredResponse, userLoginResponse, passwordlessLoginResponse } = require("../middlewares/success");

async function registerController(req, res) {
  await UserActionQuery.createUser(req.body);
  userRegisteredResponse(res);
}
async function loginController(req, res) {
  const user = await UserActionQuery.loginUser(req.body);
  userLoginResponse(res, user);
}
async function verifyEmailController(req, res) {
  const { vId } = req.params;
  const user = await UserActionQuery.verifyAccountWithVID(vId);
  userRegisteredResponse(res, "registered", user)
}
async function passwordlessLoginController(req, res) {
  await UserActionQuery.passwordlessLogin(req.body);
  passwordlessLoginResponse(res);
}
async function verifyOtpController(req, res) {
  const { otp, email } = req.body;
  const otpCode = String(otp);
  const user = await UserActionQuery.verifyOtpCode(otpCode, email);
  userLoginResponse(res, user);
}

module.exports = {
  registerController,
  loginController,
  verifyEmailController,
  passwordlessLoginController,
  verifyOtpController,
};
