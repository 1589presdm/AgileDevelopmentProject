const secret = 'my-secret' // Secret value --> Move to an environment variable !

const session = require("express-session");

module.exports = session ({
    secret: secret, 
    resave: false,  // Do not save the session again unless it is modified.
    saveUninitialized: false, // Do not save an uninitialized session.
    cookie: {
        maxAge: 15 * 60 * 1000, // Session duration set to 15 minute.
        httpOnly: true,  // Ensures that the cookie is not accessible via JavaScript.
    }
});