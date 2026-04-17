const { successMessages } = require("../utils/messages");

const response = {
  message: "",
};

function userRegisteredResponse(res, data, type = "not registered") {
  response.message = successMessages.USER_REGISTERED + " Kindly login.";
  response.data = data;
  
  if ((type === "not registered")) {
    verifyEmailResponse(res);
  }
  res.status(201).json(response);
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
