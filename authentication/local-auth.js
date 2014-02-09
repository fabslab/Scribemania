var LocalStrategy = require('passport-local').Strategy;

module.exports = {
  init: function(app, apiClient, passport) {

    // authentication strategy -
    // function provided to strategy constructor is called on POST /login (when passport.authenticate() called)

    var localStrategy = new LocalStrategy({
      passReqToCallback: true
    },
    function(req, identifier, password, done) {
      apiClient.post('/users/' + identifier + '/authenticate', { password: password }, function(err, cReq, cRes, result) {
        if (result == null || result.user == null || result.derivedKey == null) {
          req.alert('Login failed.', 'error');
          return done(err, false);
        }
        // retain authenticator (derived key) here to save into cookie session
        // and check upon subsequent access
        req.session.authenticator = result.derivedKey;
        return done(err, result.user);
      });
    });

    passport.use(localStrategy);

    // serialize user to and from session
    passport.serializeUser(function(user, done) {
      done(null, { name: user.username });
    });

    passport.deserializeUser(function(sessionUser, done) {
      apiClient.get('/users/' + sessionUser.name, function(err, cReq, cRes, user) {
        done(err, user);
      });
    });

  }
};