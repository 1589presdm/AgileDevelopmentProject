var express = require("express");
var router = express.Router();

/* Logout. */
router.get("/", function (req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to logout" });
    }

    res.redirect("/");
  });
});

module.exports = router;