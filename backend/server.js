const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const helmet = require("helmet");

// Custom Imports
const app = require("./app.js");
const AuthRouter = require("./routes/auth.routes.js");
const errorHandler = require("./middlewares/errorHandler.js");
const { PORT, APP_NAME, API_PREFIX } = require("./config/envConfig.js");
const { connectingDb } = require("./db/conn.mjs");
const { generateOtpCode } = require("./utils/verification.js");

// Definitions
const port = PORT || 3000;
const appName = APP_NAME || "App";
const apiPrefix = API_PREFIX;
const server = app;

// middlewares
server.use(helmet());
server.disable("x-powered-by");
server.use(bodyParser.json()); // To parse every body request into json format

// Api Routers
server.use(`/${apiPrefix}/auth`, AuthRouter);

// Error Handling
server.use(errorHandler);

// connecting to db;
connectingDb()

// Server listening
server.listen(port, () =>
  console.log(`${appName} Backend Server is listening on port: ${port}`),
);
