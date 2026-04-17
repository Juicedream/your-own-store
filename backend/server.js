const dotenv = require("dotenv");

// Configurations
dotenv.config();

const app = require("./app.js");
const port = process.env.PORT || 3000;
const appName = process.env.APP_NAME || "App";
const server = app;

// Server listening
server.listen(port, () =>
  console.log(`${appName} Backend Server is listening on port: ${port}`),
);
