var signature = require('cookie-signature')
  , Cookies = require('cookies')
  , nconf = require('../configuration/init.js')
  , sessionKey = nconf.get('sessionKey')
  , macKey = nconf.get('macKey');

module.exports = function(primus, apiClient) {

  primus.authorize(function authorizeSocket(req, done) {
    if (!req.headers.cookie) {
      // no cookie provided but accept connection as read-only (no userId will be set on socket)
      return done();
    }

    var cookies = new Cookies(req, null, {
      keys: [macKey]
    });
    var cookie = cookies.get(sessionKey);
    try {
      cookie = decode(cookie);
    } catch (e) {
      return done('Invalid cookie.', false);
    }

    if (!cookie.passport.user) {
      // user not logged in but accept connection as read-only (no userId will be set on socket)
      return done();
    }

    var userId = cookie.passport.user.id;

    apiClient.get('/users/' + userId, function authenticateSocketPassword(err, cReq, cRes, user) {
      if (err) {
        return done(err);
      }

      // successfully authenticated socket connection
      // attach user details to socket
      primus.transformer.once('upgrade', function(req, socket) {
        socket.user = {
          id: userId,
          username: user.displayName
        };
      });

      done();
    });

  });

};

/**
 * Decode cookie by removing base64 encoding and parsing as JSON
 * Taken from cookie-session module
 *
 * @param {String} str
 * @return {Object} Parsed cookie object
 * @api private
 */

function decode(str) {
  var body = new Buffer(str, 'base64').toString('utf8');
  return JSON.parse(body);
}