const { userRegisteredResponse } = require("../middlewares/success");

async function registerController(req, res) {
  userRegisteredResponse(res);
}
async function loginController(req, res) {}
async function verifyEmailController(req, res) {}
async function passwordlessLoginController(req, res) {}
async function verifyOtpController(req, res) {}

module.exports = {
  registerController,
  loginController,
  verifyEmailController,
  passwordlessLoginController,
  verifyOtpController,
};
