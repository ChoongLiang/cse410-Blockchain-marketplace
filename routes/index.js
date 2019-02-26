const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

/* GET homepage. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Big Market'});
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user, title: 'Big Market'
  })
);

module.exports = router;
