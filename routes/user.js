var express = require('express');
var csrf = require('csurf');
var passport = require('passport');

var Order = require('../models/order');
var Cart = require('../models/cart');

var router = express.Router();
var csrfProtection = csrf();
router.use(csrfProtection)

router.get('/profile', isLoggedIn, function(req, res, next) {
  Order.find({ user: req.user }, function(err, orders) {
    if (err) {
      return res.write('Error!');
    }
    var cart;
    orders.forEach(function(order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/profile', { orders: orders });
  });
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
})

router.use('/', notLoggedIn, function(req, res, next) {
  next();
});

router.get('/signup', function(req, res, next) {
    var messages = req.flash('error')
    res.render('user/signup', { csrfToken: req.csrfToken(), messages, hasErrors: messages.length })
  });
  
  router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
  }), function(req, res, next) {
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      return res.redirect('/user/profile');
    }
  });
  
  router.get('/signin', function(req, res, next) {
    var messages = req.flash('error')
    res.render('user/signin', { csrfToken: req.csrfToken(), messages, hasErrors: messages.length })
  });
  
  router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
  }), function(req, res, next) {
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      return res.redirect('/user/profile');
    }
  });


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/');
    }
  }