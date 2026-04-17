const { body, validationResult } = require("express-validator");
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
  userRegisterValidations: [
    body("name")
      .isLength({ min: 5 })
      .withMessage("Name must be at least 5 characters"),
    body("email").isEmail().withMessage("Enter a valid email"),
    validate,
  ],
};
