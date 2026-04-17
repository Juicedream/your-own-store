const {
  registerController,
  loginController,
  verifyEmailController,
  passwordlessLoginController,
  verifyOtpController,
} = require("../controllers/auth.controller");
const {
  userRegisterValidations,
  userLoginValidations,
  passwordlessValidations,
  otpCodeValidations,
} = require("../validations/all.validation");
const router = require("express").Router();

router
  /**
   * @swagger
   * /register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                name:
   *                  type: string
   *                email:
   *                  type: string
   *                password:
   *                  type: string
   *     responses:
   *       200:
   *         description: Check your email for verification.
   *       201:
   *        description: User Registered successfully.
   *       400:
   *         description: Bad Request.
   *       500:
   *         description: Internal Server Error.
   */
  .post("/register", userRegisterValidations, registerController)

  /**
   * @swagger
   * /login:
   *   post:
   *     summary: Logins new user
   *     tags: [Auth]
   *     requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                email:
   *                  type: string
   *                password:
   *                  type: string
   *     responses:
   *       200:
   *         description: User Logged in successfully.
   *       400:
   *         description: Bad Request.
   *       500:
   *         description: Internal Server Error.
   */
  .post("/login", userLoginValidations, loginController)

  /**
   * @swagger
   * /passwordless-login:
   *   post:
   *     summary: Logins a user with email
   *     tags: [Auth]
   *     requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                email:
   *                  type: string
   *     responses:
   *       200:
   *         description: Check your email for otp code.
   *       400:
   *         description: Bad Request.
   *       500:
   *         description: Internal Server Error.
   */
  .post(
    "/passwordless-login",
    passwordlessValidations,
    passwordlessLoginController,
  )

  /**
   * @swagger
   * /verify-otp:
   *   post:
   *     summary: Verifies otp code
   *     tags: [Auth]
   *     requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                otp:
   *                  type: string
   *     responses:
   *       200:
   *         description: Otp verified successfully.
   *       400:
   *         description: Bad Request.
   *       500:
   *         description: Internal Server Error.
   */
  .post("/verify-otp", otpCodeValidations, verifyOtpController);

/**
 * @swagger
 * /verify-email/:vId:
 *   get:
 *     summary: Verify new users email with a link
 *     tags: [Auth]
 *     parameters:
 *      - in: path
 *        name: vId
 *        required: true
 *        schema:
 *          type: string
 *          description: Verfication ID
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *       400:
 *         description: Bad Request.
 *       500:
 *         description: Internal Server Error.
 */
router.get("/verify-email/:vId", verifyEmailController);

module.exports = router;
