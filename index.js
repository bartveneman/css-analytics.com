const express = require("express");
const path = require("path");
const got = require("got");
const analyzeCss = require("@projectwallace/css-analyzer");
const { urlencoded } = require("body-parser");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", async (req, res) => {
  if (req.query.url) {
    const response = await got(`https://extract-css.now.sh/${req.query.url}`);
    const stats = await analyzeCss(response.body);
    return res.render("stats", { stats });
  }
  return res.render("index");
});

app.post("/", urlencoded({ extended: true }), async (req, res) => {
  const { css } = req.body;
  const stats = await analyzeCss(css);
  return res.render("stats", { stats });
});

module.exports = app;
