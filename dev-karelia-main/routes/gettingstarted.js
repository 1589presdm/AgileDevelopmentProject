var express = require("express");
var router = express.Router();

/* GET apis listing. */
router.get("/", function (req, res, next) {
  res.render("gettingstarted", {
    title: "Getting started with Karelia API's.",
    isLoggedIn: req.session.user ? true : false,
  });
});

module.exports = router;
