const { body, validationResult, param } = require("express-validator");
const { BadRequestError } = require("../middlewares/errors");
const validate = (req, _, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorsMessages;
    errors.array().map((error) => {
      errorsMessages += ", " + String(error.msg);
    });
    if (errorsMessages.startsWith("undefined")) {
      errorsMessages = String(errorsMessages).split(", ")[1];
      throw new BadRequestError(errorsMessages);
    }
    
    errorsMessages = String(errorsMessages).split(", ")[0];
    throw new BadRequestError(errorsMessages);

  }
  next();
};

module.exports = {
  // Auth
  userRegisterValidations: [
    body("name")
      .isLength({ min: 5 })
      .withMessage("Name must be at least 5 characters"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters").isAlphanumeric().withMessage("Password must contain numbers and letters"),
    validate,
  ],
  userLoginValidations: [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters").isAlphanumeric().withMessage("Password must contain numbers and letters"),
    validate,
  ],
  passwordlessValidations: [
    body("email").isEmail().withMessage("Enter a valid email"),
    validate,
  ],
  otpCodeValidations: [
    body("otp").isLength({ min: 6, max: 6 }).withMessage("Otp code is invalid").isNumeric().withMessage("Provide a valid otp code"),
    body("email").isEmail().withMessage("Enter a valid email"),
    validate,
  ],

  vIdValidations: [
    param("vId").isAlphanumeric().withMessage("Provide a valid verification id"),
    validate,
  ],

};
