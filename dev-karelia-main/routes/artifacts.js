const express = require("express");
const router = express.Router();
const { getAllArtifacts } = require("./db");

router.get("/", async function (req, res, next) {
  try {
    const artifacts = await getAllArtifacts();
    res.render("artifacts", {
      title: "Karelia Apps, Libs and Repositories",
      isLoggedIn: req.session.user ? true : false,
      artifacts: artifacts,
    });
  } catch (error) {
    console.error("Virhe haettaessa artifact-tietoja:", error);
    res.status(500).send("Tietokantavirhe");
  }
});

module.exports = router;
