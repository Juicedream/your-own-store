// when the resource or endpoint is not found
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
// When not authenticated like login details not valid
class UnauthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// for when user trying to access admin resource
class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// when an item in the resource is not found
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  BadRequestError,
  UnauthenticatedError,
  ForbiddenError,
  NotFoundError,
};
