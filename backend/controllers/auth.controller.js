const {
  userRegisteredResponse,
  userLoginResponse,
  passwordlessLoginResponse,
} = require("../middlewares/success");
const AuthService = require("../services/auth.service");

async function registerController(req, res) {
  await AuthService.register(req.body);
  userRegisteredResponse(res);
}
async function loginController(req, res) {
  const user = await AuthService.login(req.body);
  userLoginResponse(res, user);
}
async function verifyEmailController(req, res) {
  const { vId } = req.params;
  const user = await AuthService.verifyAccountWithVID(vId);
  userRegisteredResponse(res, "registered", user);
}
async function passwordlessLoginController(req, res) {
  await AuthService.passwordlessLogin(req.body);
  passwordlessLoginResponse(res);
}
async function verifyOtpController(req, res) {
  const { otp, email } = req.body;
  const otpCode = String(otp);
  const user = await AuthService.verifyOtpCode(otpCode, email);
  userLoginResponse(res, user);
}

module.exports = {
  registerController,
  loginController,
  verifyEmailController,
  passwordlessLoginController,
  verifyOtpController,
};
