const bcrypt = require("bcryptjs");
const { SALT } = require("../envConfig");

class PasswordEncryption {
  static async hashPassword(passwordToBeEncrypted) {
    const hashPassword = await bcrypt.hash(passwordToBeEncrypted, SALT);
    return hashPassword;
  }

  static async comparePasswords(passwordToBeDecrypted, hashedPassword) {
    const isTheSamePassword = await bcrypt.compare(
      passwordToBeDecrypted,
      hashedPassword,
    );
    return isTheSamePassword;
  }
  
  static async hashRefreshToken(refreshToken) {
    const hashedRefresh = await bcrypt.hash(refreshToken, SALT);
    return hashedRefresh;
  }

  static async compareRefreshTokens(
    refreshTokenToBeDecrypted,
    hashedRefreshToken,
  ) {
    const isTheSameRefreshToken = await bcrypt.compare(
      refreshTokenToBeDecrypted,
      hashedRefreshToken,
    );
    return isTheSameRefreshToken;
  }
}

module.exports = PasswordEncryption;
