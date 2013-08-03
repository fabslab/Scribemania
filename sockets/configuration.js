var signature = require('cookie-signature')
  , cookie = require('cookie')
  , nconf = require('../configuration/init.js')
  , passwordUtils = require('../authentication/password-utils.js')
  , sessionKey = nconf.get('sessionKey')
  , macKey = nconf.get('macKey');

module.exports = function(io, db) {
  var users = require('../data/users.js')(db);

  io.configure(function configureSocketIo() {

    io.set('authorization', function authorizeSocket(handshake, callback) {
      if (!handshake.headers.cookie) {
        // no cookie provided but accept connection as read-only
        // (no username set on handshake)
        return callback(null, true);
      }

      var socketSignedSession = cookie.parse(handshake.headers.cookie)[sessionKey];
      var socketSessionJson = parseSignedCookie(socketSignedSession, macKey);
      if (socketSessionJson === socketSignedSession) return callback('Invalid cookie.', false);

      var socketSession = parseJSONCookie(socketSessionJson);
      if (!socketSession.passport.user) {
        // user not logged in but accept connection as read-only
        // (no username set on handshake)
        return callback(null, true);
      }
      var username = socketSession.passport.user.name;
      var authenticator = socketSession.authenticator;

      users.get(username, function authenticateSocketPassword(err, user) {
        if (err) return callback(err.message, false);
        if (!user) return callback('No user found for the given username.', false);
        if (passwordUtils.createHashDigest(authenticator) === user.password) {
          // successfully authenticated socket connection
          // accept connection with full
          handshake.username = username;
          callback(null, true);
        } else {
          callback('Incorrect password.', false);
        }
      });
    });

  });
};

// The following functions are taken from connect's utils.js

/**
 * Parse a signed cookie string, return the decoded value
 *
 * @param {String} str signed cookie string
 * @param {String} secret
 * @return {String} decoded value
 * @api private
 */

function parseSignedCookie(str, secret){
  return 0 === str.indexOf('s:') ? signature.unsign(str.slice(2), secret) : str;
}

/**
 * Parse JSON cookie string
 *
 * @param {String} str
 * @return {Object} Parsed object or null if not json cookie
 * @api private
 */

function parseJSONCookie(str) {
  if (0 === str.indexOf('j:')) {
    try {
      return JSON.parse(str.slice(2));
    } catch (err) {
      // no op
    }
  }
}