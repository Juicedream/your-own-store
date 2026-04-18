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
  const { user, token } = await AuthService.login(req.body);
  userLoginResponse(res, user, token);
}
async function verifyEmailController(req, res) {
  const { vId } = req.params;
  const token = await AuthService.verifyAccountWithVID(vId);
  userRegisteredResponse(res, "registered", token);
}
async function passwordlessLoginController(req, res) {
  await AuthService.passwordlessLogin(req.body);
  passwordlessLoginResponse(res);
}
async function verifyOtpController(req, res) {
  const { otp, email } = req.body;
  const otpCode = String(otp);
  const {user, token} = await AuthService.verifyOtpCode(otpCode, email);
  userLoginResponse(res, user, token);
}

module.exports = {
  registerController,
  loginController,
  verifyEmailController,
  passwordlessLoginController,
  verifyOtpController,
};
