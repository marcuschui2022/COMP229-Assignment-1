// installed 3rd party packages
let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let favicon = require("serve-favicon");
var passport = require("passport");
var session = require("express-session");
require("dotenv").config();
// database setup
let mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

let DB = require("./config/db");

mongoose.set("strictQuery", false);

// point mongoose to the DB URI
mongoose.connect(DB.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let mongoDB = mongoose.connection;
mongoDB.on("error", console.error.bind(console, "Connection Error:"));
mongoDB.once("open", () => {
  console.log("Connected to MongoDB...");
});

let indexRouter = require("./routes/index");
let usersRouter = require("./routes/users");
let authRouter = require("./routes/auth");

let app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); // express  -e

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

app.use(
  session({
    secret: "keyboard cat",
    // resave: false,
    // saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MongoConnectionSessionString,
    }),
    // store: new SQLiteStore({
    //   db: "sessions.db",
    //   dir: path.join(__dirname, "db"),
    // }),
    // store: new SQLiteStore({ db: "sessions.db", dir: "./var/db" }),
  })
);
app.use(passport.authenticate("session"));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

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
  res.render("error", { title: "Error" });
});

module.exports = app;
