const { COOKIES_MAX_AGE, COOKIES_HTTP_ONLY, NODE_ENV } = require("../config/envConfig");
const { successMessages } = require("../utils/messages");

let response = {};
let cookieOptions = {
  maxAge: Number(COOKIES_MAX_AGE),
  httpOnly: Boolean(COOKIES_HTTP_ONLY),
  secure: NODE_ENV === "development" ? false : true,
  sameSite: NODE_ENV === "development" ? "lax" : "none"
};

function userRegisteredResponse(
  res,
  type = "not registered",
  token = "",
  refreshToken = "",
) {
  response = {};
  if (type === "not registered") {
    verifyEmailResponse(res);
    return;
  }
  response.message = successMessages.USER_REGISTERED;
  response.accessToken = token;
  // assign cookies to res
  return res
    .status(201)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(response);
}

function userLoginResponse(res, user, token, refreshToken="") {
  response = {};
  response.message = successMessages.LOGIN;
  response.accessToken = token;
  // assign cookies to res
  if (refreshToken) {
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(response);
  } else {
    return res.status(200).json(response);
  }
}

function verifyEmailResponse(res) {
  response = {};
  response.message = successMessages.VERIFY_EMAIL;
  return res.status(200).json(response);
}

function passwordlessLoginResponse(res) {
  response = {};
  response.message = successMessages.OTP_CODE_SENT;
  return res.status(200).json(response);
}

function userLogoutResponse(res, deleted=false) {
  if(deleted === true) {
    res.clearCookie("refreshToken");
    return res.status(204).json({});
  }
  return res.status(204).json({message: "No logout yet"});
}

module.exports = {
  userRegisteredResponse,
  userLoginResponse,
  verifyEmailResponse,
  passwordlessLoginResponse,
  userLogoutResponse,
};
