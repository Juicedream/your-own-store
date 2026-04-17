const express = require("express");
const app = express();


app.get("/", (req, res) => {
  res.json({ message: "We are up and ready to go!!!" });
});

app.get("/health", (req, res) => {
  res.json({ message: "We are up and ready to go!!!" });
});

module.exports = app;
