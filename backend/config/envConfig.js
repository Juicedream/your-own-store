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
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
const COOKIES_MAX_AGE = process.env.COOKIES_MAX_AGE;
const COOKIES_HTTP_ONLY = process.env.COOKIES_HTTP_ONLY;

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
  REFRESH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  GOOGLE_REDIRECT_URL,
  COOKIES_MAX_AGE,
  COOKIES_HTTP_ONLY,
};
