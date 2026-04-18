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
}

module.exports = PasswordEncryption;
