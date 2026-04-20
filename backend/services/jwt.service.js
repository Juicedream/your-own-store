const { BadRequestError } = require("../middlewares/errors");
const { JWT_SECRET, REFRESH_SECRET } = require("../config/envConfig");
const jwt = require("jsonwebtoken");

class JwtService {
  static async generateJwtToken(payload) {
    const { id, role } = payload;
    if (!id || !role) {
      throw new BadRequestError(
        "All payload values are required to generate Jwt Token",
      );
    }
    const expiresIn = "1h";
    const token = jwt.sign({ sub: id, role }, JWT_SECRET, {
      expiresIn,
    });
    return token;
  }

  static async verifyJwtToken(token) {
    const verifiedToken = jwt.verify(token, JWT_SECRET);
    return verifiedToken;
  }

  static async generateRefreshToken(userId) {
    if (!userId) {
      throw new BadRequestError("All payload values are required to generate refresh token");
    }
    const expiresIn = '7d';
    const payload = { sub: userId };
    const token = jwt.sign(payload, REFRESH_SECRET, {
      expiresIn,
    });
    return token;
  }

  static async verifyRefreshToken(token) {
    const decoded =  jwt.verify(token, REFRESH_SECRET);
    return decoded;
  }
}

module.exports = JwtService;
