const { errorMessages } = require("../utils/messages");

const errorHandler = (err, _, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || JSON.parse(err.message) || errorMessages.SERVER_ERROR;
  console.error(`[Error] ${err.message}`);
  res.status(statusCode).json({
    success: false,
    message,
    // Hide stack trace in production for security reasons
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
