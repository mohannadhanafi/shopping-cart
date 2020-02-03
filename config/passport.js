var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  })
});

passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
  req.checkBody('password', 'Invalid Password').notEmpty().isLength({ min: 4 });
  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(function(error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
  User.findOne({ 'email': email }).then(user => {
    if (user) return done(null, false, { message: 'Email is already in use.' });
    var newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.save(function(err, result) {
      if (err) return done(err)
      else done(null, newUser)
    })
  })
}));

passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, function(req, email, password, done) {
  req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
  req.checkBody('password', 'Invalid Password').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(function(error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
  User.findOne({ 'email': email }).then(user => {
    if (!user) return done(null, false, { message: 'No User Found.' });
    if (!user.validPassword(password)) {
      return done(null, false, { message: 'Wrong Password' });
    }
    return done(null, user);
  });
}));
