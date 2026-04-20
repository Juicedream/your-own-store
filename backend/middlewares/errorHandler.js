const { NODE_ENV } = require("../config/envConfig");
const { errorMessages } = require("../utils/messages");

const errorHandler = (err, _, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Server Error" || errorMessages.SERVER_ERROR;
  console.error(`[Error] ${err.message}`);
  res.status(statusCode).json({
    success: false,
    message,
    // Hide stack trace in production for security reasons
    stack: NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
