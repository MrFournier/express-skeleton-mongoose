var express = require('express');
var passport = require('passport');
var router = express.Router();

router.post('/', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

module.exports = router;
