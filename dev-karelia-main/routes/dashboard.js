var express = require("express");
var router = express.Router();
const { addApi } = require("./db");
const multer = require("multer");
const upload = multer({ dest: "public/uploads/" });

// Check if the user is logged in.
const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/login"); // Is not logged in -> Redirects the user to the login page.
  }
  res.locals.isLoggedIn = req.session.user ? true : false;
  next();
};

// GET Dashboard.
router.get("/", isAuthenticated, (req, res) => {
  const apikey = req.session.apikey;
  const user = req.session.user.username;

  // Return the API key and render the dashboard view.
  return res.render("dashboard", {
    title: "Dashboard",
    isLoggedIn: req.session.user ? true : false,
    user: user,
    apiKey: apikey,
  });
});

// POST: Lisää uusi API-tietue
router.post(
  "/add",
  isAuthenticated,
  upload.single("image"),
  async (req, res) => {
    const { name, description, link } = req.body;
    const image = `/uploads/${req.file.filename}`;

    try {
      await addApi({ name, description, link, image });
      res.redirect("/apis");
    } catch (error) {
      console.error("Virhe API:n lisäyksessä:", error);
      res.status(500).send("API:n lisääminen epäonnistui.");
    }
  }
);

module.exports = router;
