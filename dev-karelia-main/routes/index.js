var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Karelia Developer Portal',
    isLoggedIn: req.session.user ? true : false
   });
});

module.exports = router;
