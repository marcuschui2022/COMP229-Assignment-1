var express = require("express");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var crypto = require("crypto");
var db = require("../config/db");
const { User } = require("../models/user");
var router = express.Router();

passport.use(
  new LocalStrategy(function verify(username, password, cb) {
    User.findOne({ username }).then((user) => {
      if (!user) {
        return cb(null, false, {
          message: "Incorrect username or password.",
        });
      }

      //   const hashPassword = crypto
      //     .pbkdf2Sync(password, user.salt, 310000, 32, `sha256`)
      //     .toString(`hex`);

      //   console.log(hashPassword);
      //   console.log(user.password);
      //   if (hashPassword === user.password) {
      //     console.log("right");
      //     return cb(null, user);
      //   } else {
      //     console.log("not right");
      //     return cb(null, false, {
      //       message: "Incorrect username or password.",
      //     });
      //   }

      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        function (err, hashedPassword) {
          if (err) {
            return cb(err);
          }
          if (user.password !== hashedPassword.toString("hex")) {
            // console.log("not right");
            return cb(null, false, {
              message: "Incorrect username or password.",
            });
          }
          // console.log("right");
          return cb(null, user);
        }
      );
    });
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.get("/login", function (req, res, next) {
  //   res.render("login");

  res.render("auth/login", { title: "Login", user: req.user });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/business",
    failureRedirect: "/auth/login",
    failureMessage: true,
  })
);

router.post("/signup", function (req, res, next) {
  console.log(req.body);
  var salt = crypto.randomBytes(16).toString("hex");
  crypto.pbkdf2(
    req.body.password,
    salt,
    310000,
    32,
    "sha256",
    function (err, hashedPassword) {
      if (err) {
        return next(err);
      }

      const newUser = new User({
        username: req.body.username,
        password: hashedPassword.toString("hex"),
        salt: salt.toString("hex"),
        email: req.body.email,
      });

      User.create(newUser)
        .then((user) => {
          console.log(user.username);
          // res.send("done");
          req.login(user, function (err) {
            if (err) {
              return next(err);
            }
            res.redirect("/");
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/");
        });
    }
  );
});

router.get("/signup", function (req, res, next) {
  //   res.render("login");
  res.render("auth/signup", { title: "Signup" });
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
