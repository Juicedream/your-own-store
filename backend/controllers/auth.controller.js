const passport = require("passport");
const {
  userRegisteredResponse,
  userLoginResponse,
  passwordlessLoginResponse,
} = require("../middlewares/success");
const {AuthService} = require("../services/auth.service");
const { GOOGLE_REDIRECT_URL } = require("../config/envConfig");

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

async function googleCallbackController(req, res) {
   passport.authenticate("google", function (err, profile, info, status) {
      if (err) {
        console.log(err);
        return res.send("An error occurred");
      }
      if (!profile) {
        return res.send("No Profile found");
      }
      res.redirect(GOOGLE_REDIRECT_URL + profile.userId);
    })(req, res);
}

async function successGoogleSignInController(req, res) {
  const { id } = req.query;
  const { user, token } = await AuthService.googleSignIn(id);
  userLoginResponse(res, user, token);
}



module.exports = {
  registerController,
  loginController,
  verifyEmailController,
  passwordlessLoginController,
  verifyOtpController,
  googleCallbackController,
  successGoogleSignInController,
};
