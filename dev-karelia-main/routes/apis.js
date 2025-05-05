const express = require("express");
const router = express.Router();
const { getAllApis } = require("./db");

router.get("/", async function (req, res, next) {
  try {
    const apis = await getAllApis();
    res.render("apis", {
      title: "Karelia APIs",
      isLoggedIn: !!req.session.user,
      apis: apis,
    });
  } catch (error) {
    console.error("Virhe haettaessa API-tietoja:", error);
    res.status(500).send("Tietokantavirhe");
  }
});

module.exports = router;
