var express = require('express');
var router = express.Router();

/* GET apis listing. */
router.get('/', function(req, res, next) {
    res.render('artifacts', { 
        title: 'Karelia Apps, Libs and Repositories',
        isLoggedIn: req.session.user ? true : false
     });
});

module.exports = router;