const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const options = require("./config/swaggerJSOptions");

// swagger configuration
const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({ message: "We are up and ready to go!!!" });
});

app.get("/health", (req, res) => {
  res.json({ message: "We are up and ready to go!!!" });
});

module.exports = app;
