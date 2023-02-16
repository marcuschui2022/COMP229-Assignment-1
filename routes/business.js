var express = require("express");
var router = express.Router();

/* GET Business Contacts List. */
router.get("/", function (req, res, next) {
  if (req.user) {
    res.render("business/index", {
      title: "Business Contacts List",
      user: req.user,
    });
  } else {
    res.redirect("/auth/login");
  }
});

module.exports = router;
