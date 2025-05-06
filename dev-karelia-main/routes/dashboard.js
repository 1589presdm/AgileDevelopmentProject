var express = require("express");
var router = express.Router();
const { addApi, addArtifact } = require("./db");

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
router.post("/add", async (req, res) => {
  const { name, description, link, image } = req.body;

  try {
    await addApi({ name, description, link, image });
    res.redirect("/apis"); // onnistumisen jälkeen siirrytään katsomaan API-listaa
  } catch (error) {
    res.status(500).send("API:n lisääminen epäonnistui.");
  }
});

// POST: lisää uusi App/Repo/Lib
router.post("/addApp", async (req, res) => {
  const { name, description, link, image } = req.body;

  try {
    await addArtifact({ name, description, link, image });
    res.redirect("/artifacts");
  } catch (error) {
    console.error("Virhe lisättäessä artifaktin", error);
    res.status(500).send("Artifaktin lisääminen epäonnistui.");
  }
});


module.exports = router;