const {
  registerController,
  loginController,
  verifyEmailController,
  passwordlessLoginController,
  verifyOtpController,
  successGoogleSignInController,
  googleCallbackController,
} = require("../controllers/auth.controller");
const {
  userRegisterValidations,
  userLoginValidations,
  passwordlessValidations,
  otpCodeValidations,
} = require("../validations/all.validation");
const router = require("express").Router();
const GoogleStrategy = require("passport-google-oidc");
const passport = require("passport");
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
} = require("../config/envConfig");
const { AuthService } = require("../services/auth.service");

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async function verify(issuer, profile, cb) {
      await AuthService.signInWithGoogle(issuer, profile, cb);
    },
  ),
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, {
      id: user.id,
      username: user.username,
      name: user.name,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

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

router
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
  .get("/verify-email/:vId", verifyEmailController)
  
  /**
   * @swagger
   * /auth/sign-in-google:
   *   get:
   *     summary: Users can sign in with google
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Google sign in was successful.
   *       400:
   *         description: Bad Request.
   *       500:
   *         description: Internal Server Error.
   */
  .get("/sign-in-with-google", googleCallbackController)

  /**
   * @swagger
   * /auth/google-success:
   *   get:
   *     summary: Verify new users email with a link
   *     tags: [Auth]
   *     parameters:
   *       - in: query
   *         name: id
   *         schema:
   *           type: string
   *         description: The user id
   *     responses:
   *       200:
   *         description: User Logged in.
   *       400:
   *         description: Bad Request.
   *       500:
   *         description: Internal Server Error.
   */
  .get("/google-success", successGoogleSignInController) // query parameters

  // /**
  //  * @swagger
  //  * /auth/redirect/google:
  //  *   get:
  //  *     summary: Redirects users to google
  //  *     tags: [Auth]
  //  *     responses:
  //  *       200:
  //  *         description: Redirects to google.
  //  *       400:
  //  *         description: Bad Request.
  //  *       500:
  //  *         description: Internal Server Error.
  //  */
 
  // .get("/redirect/google", googleCallbackController);

module.exports = router;
