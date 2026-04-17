const dotenv = require("dotenv");
const bodyParser = require("body-parser");

// Configurations
dotenv.config();

// Custom Imports
const app = require("./app.js");
const AuthRouter = require("./routes/auth.routes.js");
const errorHandler = require("./middlewares/errorHandler.js");


// Definitions
const port = process.env.PORT || 3000;
const appName = process.env.APP_NAME || "App";
const apiPrefix = process.env.API_PREFIX;
const server = app;

// middlewares
app.use(bodyParser.json()); // To parse every body request into json format

// Api Routers
server.use(`/${apiPrefix}/`, AuthRouter);


// Error Handling
server.use(errorHandler);

// Server listening
server.listen(port, () =>
  console.log(`${appName} Backend Server is listening on port: ${port}`),
);
