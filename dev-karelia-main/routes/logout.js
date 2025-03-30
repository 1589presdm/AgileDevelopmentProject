var express = require("express");
var router = express.Router();

/* Logout. */
router.get("/", function (req, res, next) {

    // Destroy session.
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to logout' });
        }
        // Redirect to login page.
        res.redirect('/login');
    });

  });


module.exports = router;