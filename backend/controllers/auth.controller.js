const passport = require("passport");
const {
  userRegisteredResponse,
  userLoginResponse,
  passwordlessLoginResponse,
  userLogoutResponse,
} = require("../middlewares/success");
const { AuthService } = require("../services/auth.service");
const { GOOGLE_REDIRECT_URL } = require("../config/envConfig");

async function registerController(req, res, next) {
  try {
    await AuthService.register(req.body);
    userRegisteredResponse(res);
  } catch (error) {
    next(error);
  }
}
async function loginController(req, res, next) {
  try {
    const data  = await AuthService.login(req.body);
    userLoginResponse(res, data.user, data.token, data.refreshToken);
  } catch (error) {
    next(error);
  }
}
async function verifyEmailController(req, res, next) {
  try {
    const { vId } = req.params;
    const data = await AuthService.verifyAccountWithVID(vId);
    userRegisteredResponse(res, "registered", data.token);
  } catch (error) {
    next(error);
  }
}
async function passwordlessLoginController(req, res, next) {
  try {
    await AuthService.passwordlessLogin(req.body);
    passwordlessLoginResponse(res);
  } catch (error) {
    next(error);
  }
}
async function verifyOtpController(req, res, next) {
  try {
    const { otp, email } = req.body;
    const otpCode = String(otp);
    const { user, token, refreshToken } = await AuthService.verifyOtpCode(otpCode, email);
    userLoginResponse(res, user, token, refreshToken);
  } catch (error) {
    next(error);
  }
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

async function successGoogleSignInController(req, res, next) {
  try {
    const { id } = req.query;
    const { user, token } = await AuthService.googleSignIn(id);
    userLoginResponse(res, user, token);
  } catch (error) {
    next(error);
  }
}
async function newAccessTokenWithValidRefreshTokenController(req, res, next) {
  const { id, role } = req.user;
  const { accessToken } = await AuthService.newAccessToken(id, role);
  userLoginResponse(res, null, accessToken, null);
}

async function logoutController(req, res, next) {
  try {
    const { id: userId } = req;
    const { deleted } = await AuthService.logout(userId);
    userLogoutResponse(res, deleted);
  } catch (error) {
    next(error)
  }
}

module.exports = {
  registerController,
  loginController,
  verifyEmailController,
  passwordlessLoginController,
  verifyOtpController,
  googleCallbackController,
  successGoogleSignInController,
  newAccessTokenWithValidRefreshTokenController,
  logoutController,
};
