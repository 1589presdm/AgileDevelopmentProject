var express = require("express");
var router = express.Router();

// Check if the user is logged in.
const isAuthenticated = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/login'); // Is not logged in -> Redirects the user to the login page.
    }
    res.locals.isLoggedIn = req.session.user ? true : false;
    next();
};

// GET Dashboard. 
router.get("/", isAuthenticated, (req, res) => {
    
    const apikey = req.session.apikey;
    const user = req.session.user.username;

    // Return the API key and render the dashboard view.
    return res.render('dashboard', { 
        title: "Dashboard",
        isLoggedIn: req.session.user ? true : false,
        user: user,
        apiKey: apikey
    });

});

module.exports = router;
