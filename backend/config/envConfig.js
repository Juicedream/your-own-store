const dotenv = require("dotenv").config();

const PORT = process.env.PORT;
const APP_NAME = process.env.APP_NAME;
const API_PREFIX = process.env.API_PREFIX;
const NODE_ENV = process.env.NODE_ENV;
const BACKEND_URL = process.env.BACKEND_URL;
const MONGO_URI = process.env.MONGO_URI;
const SALT = Number(process.env.SALT);
const MAIL_USERNAME = process.env.MAIL_USERNAME;
const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  PORT,
  APP_NAME,
  API_PREFIX,
  NODE_ENV,
  BACKEND_URL,
  MONGO_URI,
  SALT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  JWT_SECRET,
};
