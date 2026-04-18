const { BadRequestError } = require("../middlewares/errors");
const { JWT_SECRET } = require("../config/envConfig");
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
    jwt.verify(token, JWT_SECRET, function (err, decoded) {
      return { err, decoded };
    });
  }
}

module.exports = JwtService;
