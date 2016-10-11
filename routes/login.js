var express = require('express');
var passport = require('passport');
//var Agent = require('../models/agent');
var router = express.Router();

/* GET users listing. */
//router.get('/', function(req, res, next) {
//  res.send('respond with a resource');
//});


router.get('/', function(req, res) {
  res.render('login', { user : req.user });
});

router.post('/', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

module.exports = router;
