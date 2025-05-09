var express = require("express");
var router = express.Router();

/* GET partners page. */
router.get("/", function (req, res, next) {
  res.render("partners", {
    title: "For Karelia's partner organizations.",
    isLoggedIn: req.session.user ? true : false,
    ns: "partners",
  });
});

module.exports = router;
