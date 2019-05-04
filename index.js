const express = require("express");
const path = require("path");
const got = require("got");
const analyzeCss = require("@projectwallace/css-analyzer");
const { urlencoded } = require("body-parser");
const formatFilesize = require("pretty-bytes");
const normalizeUrl = require("normalize-url");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use((req, res, next) => {
  res.locals.formatFilesize = formatFilesize;
  res.locals.formatNumber = number =>
    Number.isInteger(number)
      ? new Intl.NumberFormat().format(number)
      : parseFloat(number).toFixed(3);
  next();
});

app.get("/", async (req, res) => {
  const url = req.query.url
    ? normalizeUrl(req.query.url, { stripWWW: false })
    : undefined;

  if (url) {
    const response = await got(`https://extract-css.now.sh/${url}`);
    const css = response.body;
    const stats = await analyzeCss(css);
    return res.render("stats", { stats, css, url });
  }
  return res.render("index");
});

app.post("/", urlencoded({ extended: true }), async (req, res) => {
  const { css } = req.body;
  const stats = await analyzeCss(css);
  return res.render("stats", { stats, css, url: undefined });
});

module.exports = app;
