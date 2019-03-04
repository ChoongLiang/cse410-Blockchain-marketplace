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

// Index-Active
router.get('/index-active', function (req, res) {
    res.render('index-active', {title: 'Big Market'});
});

// About-Inactive
router.get('/about', function (req, res) {
    res.render('about', {title: 'Big Market'});
});

// About-Active
router.get('/about-active', function (req, res) {
    res.render('about-active', {title: 'Big Market'});
});

module.exports = router;
