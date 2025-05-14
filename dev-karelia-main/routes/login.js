var express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var router = express.Router();
const secretKey = "my-secret-key"; // Move to an environment variable !
const { getUserByUsername, updateUserApiKey } = require("./db");

/* GET login page. */
router.get("/", function (req, res, next) {
  const t = req.i18n.getFixedT(req.language, "common"); // gives access to "common" namespace
  res.render("login", {
    title: "Login",
    t, // t-function
    isLoggedIn: req.session.user ? true : false,
  });
});

/* POST login */
router.post("/", async function (req, res) {
  const { username, password } = req.body;

  try {
    // Check if user exists.
    const user = await getUserByUsername(username);

    // If user not found.
    if (!user) {
      console.error("User not found");
      return res.status(401).json({ success: false });
    }

    // Check password.
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.error("Wrong password");
      return res.status(401).json({ success: false });
    }

    // Check API key
    if (user.api_key) {
      try {
        decoded_key = jwt.verify(user.api_key, secretKey);
        const now = Date.now() / 1000;

        // If the user's api key is still valid.
        if (decoded_key.exp >= now) {
          // Create session and save user and token to session.
          req.session.user = { username: user.username };
          req.session.apikey = user.api_key;
          console.log("Session created: ", req.session.user);

          // Return a successful login.
          return res.json({
            success: true,
            message: "Login successful",
          });
        }
      } catch (err) {
        console.error("JWT verification failed:", err.message);
      }
    }

    // Create new token.
    const token = jwt.sign({ username: user.username }, secretKey, {
      expiresIn: "8h",
    });

    // Update user's apikey.
    await updateUserApiKey(user.username, token);

    // Create session and save user and token to session.
    req.session.user = { username: user.username };
    req.session.apikey = token;
    console.log("Session created: ", req.session.user);

    // Return a successful login.
    return res.json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
