const { successMessages } = require("../utils/messages");

let response = {};

function userRegisteredResponse(res, type = "not registered", data = {}) {
  response = {};
  if (type === "not registered") {
    verifyEmailResponse(res);
    return;
  }
  response.message = successMessages.USER_REGISTERED;
  response.token = data;
  return res.status(201).json(response);
}
function userLoginResponse(res, user, token) {
  response = {};
  response.message = successMessages.LOGIN;
  // response.user = {...user}
  response.token = token;
  return res.status(200).json(response);
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



module.exports = {
  userRegisteredResponse,
  userLoginResponse,
  verifyEmailResponse,
  passwordlessLoginResponse,
};
