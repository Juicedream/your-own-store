const { successMessages } = require("../utils/messages");

const response = {
  message: "",
};

function userRegisteredResponse(res, type = "not registered", data = {}) {
  if (type === "not registered") {
    verifyEmailResponse(res);
    return;
  }
  response.message = successMessages.USER_REGISTERED;
  response.data = data;
  return res.status(201).json(response);
}
function userLoginResponse(res) {
  response.message = successMessages.LOGIN;
  return res.status(200).json(response);
}

function verifyEmailResponse(res) {
  response.message = successMessages.VERIFY_EMAIL;
  return res.status(200).json(response);
}

module.exports = {
  userRegisteredResponse,
  userLoginResponse,
  verifyEmailResponse,
};
