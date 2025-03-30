var express = require('express');
var router = express.Router();

/* GET apis listing. */
router.get('/', function(req, res, next) {
    res.render('apis', { 
        title: 'Karelia APIs', 
        isLoggedIn: req.session.user ? true : false
    });
});

module.exports = router;