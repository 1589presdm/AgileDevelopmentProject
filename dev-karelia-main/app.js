const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");
const path = require("path");

require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var partnersRouter = require("./routes/partners");
var artifactsRouter = require("./routes/artifacts");
var apisRouter = require("./routes/apis");
var gettingStartedRouter = require("./routes/gettingstarted");
var loginRouter = require("./routes/login");
var dashboardRouter = require("./routes/dashboard");
var sessionRouter = require("./routes/session");
var logoutRouter = require("./routes/logout");

var app = express();

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    preload: ["en", "fi"],
    ns: ["index", "partners", "gettingstarted", "common"],
    defaultNS: "index",
    backend: {
      loadPath: path.join(__dirname, "locales/{{lng}}/{{ns}}.json"),
    },
    detection: {
      order: ["cookie", "querystring", "header"],
      caches: ["cookie"],
    },
  });

app.use(
  middleware.handle(i18next, {
    removeLngFromUrl: false,
  })
);

app.use((req, res, next) => {
  res.locals.t = req.t;
  res.locals.lng = req.language;
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(sessionRouter);

app.get("/change-language/:lng", (req, res) => {
  const newLang = req.params.lng;
  res.cookie("i18next", newLang, {
    maxAge: 1000 * 60 * 60 * 24 * 365, // vaikuttaa kielivalinnan pysyvyyteen
    httpOnly: false,
  });
  const returnTo = req.get("Referer") || "/";
  res.redirect(returnTo);
});

app.use("/", indexRouter);
app.use("/partners", partnersRouter);
app.use("/artifacts", artifactsRouter);
app.use("/apis", apisRouter);
app.use("/gettingstarted", gettingStartedRouter);
app.use("/dashboard", dashboardRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
