const { text } = require("micro");
const analyzeCss = require("@projectwallace/css-analyzer");
const url = require("url");
const got = require("got");
const pug = require("pug");
const path = require("path");

const pugOptions = {
  basedir: path.join(__dirname, "./views"),
  debug: true,
  compileDebug: true
};

const indexTemplate = pug.compileFile("index.pug", pugOptions)();
const statsTemplate = pug.compileFile("stats.pug", pugOptions);

module.exports = async req => {
  if (req.method === "POST") {
    const body = await text(req, { limit: "4mb" });
    const css = decodeURIComponent(body).substring(4);
    const stats = await analyzeCss(css);
    return statsTemplate({ stats });
  }

  const { query } = url.parse(req.url, true);

  if (query.url) {
    const { body } = await got(`https://extract-css.now.sh/${query.url}`);
    const stats = await analyzeCss(body);
    return statsTemplate({ stats });
  }

  return indexTemplate;
};
