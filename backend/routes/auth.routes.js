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
   * /auth/register:
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
   *                  example: James Allen
   *                email:
   *                  type: string
   *                  example: james@example.com
   *                password:
   *                  type: string
   *                  example: test1234
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
   * /auth/login:
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
   *                  example: james@example.com
   *                password:
   *                  type: string
   *                  example: test1234
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
   * /auth/passwordless-login:
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
   *                  example: james@example.com
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
   * /auth/verify-otp:
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
   *                  example: 123456
   *                email:
   *                  type: string
   *                  example: "james@example.com"
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
 * /auth/verify-email/{vId}:
 *   get:
 *     summary: Verify new users email with a link
 *     tags: [Auth]
 *     parameters:
 *      - in: path
 *        name: vId
 *        required: true
 *        schema:
 *          type: string
 *          example: 1111111888333aa
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
