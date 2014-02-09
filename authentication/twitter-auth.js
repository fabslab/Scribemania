var config = require('../configuration/init.js')
  , TwitterStrategy = require('passport-twitter').Strategy;

module.exports = {

  init: function(app, apiClient, passport) {

    var twitterStrategy = new TwitterStrategy({
        consumerKey: config.get('twitterConsumerKey'),
        consumerSecret: config.get('twitterConsumerSecret'),
        callbackURL: config.get('twitterCallbackURL')
      },
      function(token, tokenSecret, profile, done) {
        return done(profile);
      }
    );

    passport.use(twitterStrategy);

    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(user, done) {
      done(null, user);
    });
  }

}