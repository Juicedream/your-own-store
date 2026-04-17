const {
  registerController,
  loginController,
  verifyEmailController,
  passwordlessLoginController,
  verifyOtpController,
} = require("../controllers/auth.controller");
const router = require("express").Router();

router
  .post("/register", registerController)
  .post("/login", loginController)
  .post("/passwordless-login", passwordlessLoginController)
  .post("/verify-otp", verifyOtpController);

router  
  .get("/verify-email", verifyEmailController)


module.exports = router;
