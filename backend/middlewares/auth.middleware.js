const PasswordEncryption = require("../config/encryptions/passwordEncryption");
const { UserActionQuery } = require("../db/dbQuery");
const JwtService = require("../services/jwt.service");
const { errorMessages } = require("../utils/messages");
const { UnauthenticatedError, BadRequestError, NotFoundError } = require("./errors");

async function validateAccessToken(req, res, next) {
  const token = req.headers.startWith("Bearer").split(" ")[1];
  if (!token) {
    throw new UnauthenticatedError("Unauthorized access - Token is required");
  }
  let verifiedToken;
  try {
    verifiedToken = await JwtService.verifyJwtToken(token);
  } catch (error) {
    if (error) {
      throw new UnauthenticatedError(
        "Unauthorized access - Expired or Invalid Token",
      );
    }
  }
  const { sub, role } = verifiedToken;
  req.id = sub;
  req.role = role;
  next();
}

async function validateRefreshToken(req, res, next) {
  const {refreshToken} = req.cookies;
  if (!refreshToken) {
    throw new BadRequestError("Refresh Token is required");
  }
  let decodedRefreshToken;
  try {
    decodedRefreshToken = await JwtService.verifyRefreshToken(refreshToken);
  } catch (error) {
    if (error) {
      throw new BadRequestError("Expired or Invalid Refresh Token");
    }
  }

  const { sub } = decodedRefreshToken;
  const userId = sub;

  // fetch the user's stored refresh token from database by userId
  let storedRefreshToken;
  storedRefreshToken = await UserActionQuery.getUserRefreshToken(userId);
  if (storedRefreshToken.error) {
    throw new BadRequestError("No Refresh Token stored for this user");
  }
  const hashedRefreshToken = storedRefreshToken.refreshToken;

  // compare the refreshToken provided with the one stored in database
  const isSameRefreshToken = await PasswordEncryption.compareRefreshTokens(
    refreshToken,
    hashedRefreshToken,
  );
  if (!isSameRefreshToken) {
    throw new UnauthenticatedError(
      "Unauthorized access - Invalid Refresh Token",
    );
  }

  req.id = userId;
  next();
}

async function getUserMiddleware(req, res, next) {
  const { id } = req;
  if (!id) {
    throw new UnauthenticatedError("Unauthorized access - User Id is required");
  }
  const user = await UserActionQuery.findUser(id, "id");
  if (!user) {
    throw new NotFoundError(errorMessages.USER_NOT_FOUND);
  }
  req.user = { id: id, role: user.role }
  next();
}


module.exports = {
  validateAccessToken,
  validateRefreshToken,
  getUserMiddleware
}