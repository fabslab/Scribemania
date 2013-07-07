var LocalStrategy = require('passport-local').Strategy;
var passwordUtils = require('./passwordUtils.js');

module.exports = function(app, db, passport) {
  var users = require('../data/users.js')(db);

  // authentication strategy -
  // function provided to strategy constructor is called on POST /login (when passport.authenticate() called)

  var localStrategy = new LocalStrategy({ passReqToCallback: true }, function(req, identifier, password, done) {
    users.authenticateLogin(identifier, password, function(err, user, authenticator) {
      if (!user) {
        req.alert('Login failed.', 'error');
        return done(err, false);
      }
      // retain authenticator (derived key) here to save into cookie session
      // and check upon subsequent access
      req.session.authenticator = authenticator;
      return done(err, user);
    });
  });

  passport.use(localStrategy);

  // serialize user to and from session
  passport.serializeUser(function(user, done) {
    done(null, { name: user.username });
  });

  passport.deserializeUser(function(sessionUser, done) {
    users.get(sessionUser.name, function(err, user) {
      done(err, user);
    });
  });

  // Connect middleware to verify a logged-in user's authenticity
  app.use(function verifyAuthentication(req, res, next) {
    var user = req.user;
    if (!user) return next();
    if (passwordUtils.createHashDigest(req.session.authenticator) === user.password) {
      res.locals.username = user.username;
      return next();
    }
    req.logOut();
    req.session = null;
    res.redirect('/login');
  });

};