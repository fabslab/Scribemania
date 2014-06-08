var config = require('../configuration/init.js')
  , FacebookStrategy = require('passport-facebook').Strategy;

module.exports = {

  init: function(app, apiClient, passport) {

    var facebookStrategy = new FacebookStrategy({
        clientID: config.get('facebookAppID'),
        clientSecret: config.get('facebookAppSecret'),
        callbackURL: config.get('facebookCallbackURL'),
        enableProof: true
      },
      function(accessToken, refreshToken, profile, done) {
        var location = profile._json.location || {};

        var user = {
          providerId: profile.provider + profile.id,
          provider: profile.provider,
          providerProfile: profile.profileUrl || profile._json.link,
          displayName: profile.displayName,
          name: profile.name,
          picture: 'https://graph.facebook.com/' + profile.id + '/picture?type=large',
          email: profile._json.email,
          gender: profile.gender || profile._json.gender,
          location: location.name,
          locale: profile._json.locale
        };

        apiClient.get('/users/' + user.email, function(err, cReq, cRes, result) {
          if (cRes.statusCode != 404){
            done(err, result);
          } else {
            // if this is a new user and doesn't exist yet we will add them to our records
            apiClient.post('/users', { user: user }, function(err, cReq, cRes, result) {
              done(err, result);
            });
          }
        });
      }
    );

    passport.use(facebookStrategy);

  }

};
