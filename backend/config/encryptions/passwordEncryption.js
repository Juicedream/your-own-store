const bcrypt = require("bcryptjs");
const { SALT } = require("../envConfig");

async function hashPassword(passwordToBeEncrypted) {
  const hashPassword = await bcrypt.hash(passwordToBeEncrypted, SALT);
  return hashPassword;
}

async function comparePasswords(passwordToBeDecrypted, hashedPassword) {
  const isTheSamePassword = await bcrypt.compare(passwordToBeDecrypted, hashedPassword);
  return isTheSamePassword;
}


module.exports = {
  hashPassword,
  comparePasswords,
}