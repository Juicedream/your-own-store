const {
  registerController,
  loginController,
  verifyEmailController,
  passwordlessLoginController,
  verifyOtpController,
} = require("../controllers/auth.controller");
const { userRegisterValidations } = require("../validations/all.validation");
const router = require("express").Router();

router
  .post(
    "/register",
    userRegisterValidations,
    registerController,
  )
  .post("/login", loginController)
  .post("/passwordless-login", passwordlessLoginController)
  .post("/verify-otp", verifyOtpController);

router.get("/verify-email", verifyEmailController);

module.exports = router;
