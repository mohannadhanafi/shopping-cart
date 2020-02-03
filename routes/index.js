var express = require('express');
var csrf = require('csurf');

var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function(err, result) {
    res.render('shop/index', { title: 'Express', products: result, successMsg: successMsg, noMessage: !successMsg });
  });
});

router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {})

  Product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, productId);
    req.session.cart = cart;
    res.redirect('/');
  })
});

router.get('/reduce/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {})

  cart.redyceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {})

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', { products: null })
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice })
});

router.get('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart')
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0]
  res.render('shop/checkout', { total: cart.totalPrice, noError: !errMsg, errMsg: errMsg })
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart')
  }

  var cart = new Cart(req.session.cart);

  var stripe = require("stripe")(
    "sk_test_KvfS0ueUFUlVwqEV7Osi82tC00V13dbiji"
  );

stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test Charge"
}, function(err, charge) {
  if (err) {
    req.flash('error', err.message);
    return res.redirect('/checkout')
  }
  var order = new Order({
    user: req.user,
    cart: cart,
    address: req.body.address,
    name: req.body.name,
    paymentId: charge.id
  });
  order.save(function(err, result) {
    req.flash('success', 'Successfully bought products');
    req.session.cart = null;
    res.redirect('/');
  })
});
})

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}