module.exports = function(params) {
  var passport = params.passport
    , LocalStrategy = require('passport-local').Strategy
    , users = require('./data/users.js')(params.db);

  // authentication strategy
  passport.use(new LocalStrategy(
    function(username, password, done) {
      users.get(username, password, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect login.' });
        }
        return done(null, user);
      });
    }
  ));

  // serialize user to and from session
  passport.serializeUser(function(user, done) {
    done(null, { name: user.name, securePass: user.password });
  });
  passport.deserializeUser(function(sessionUser, done) {
    users.get(sessionUser.name, sessionUser.securePass, function(user) {
      done(null, user);
    });
  });

  var redirects = {
    successRedirect: '/',
    failureRedirect: '/login'
  };

  params.app.post('/login', passport.authenticate('local', redirects));

};