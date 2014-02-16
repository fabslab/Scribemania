var signature = require('cookie-signature')
  , cookie = require('cookie')
  , nconf = require('../configuration/init.js')
  , sessionKey = nconf.get('sessionKey')
  , macKey = nconf.get('macKey');

module.exports = function(io, apiClient) {

  io.configure(function configureSocketIo() {

    io.set('authorization', function authorizeSocket(handshake, callback) {
      if (!handshake.headers.cookie) {
        // no cookie provided but accept connection as read-only (no userId will be set on handshake)
        return callback(null, true);
      }

      var socketSignedSession = cookie.parse(handshake.headers.cookie)[sessionKey];
      var socketSessionJson = parseSignedCookie(socketSignedSession, macKey);
      if (socketSessionJson === socketSignedSession) return callback('Invalid cookie.', false);

      var socketSession = parseJSONCookie(socketSessionJson);
      if (!socketSession.passport.user) {
        // user not logged in but accept connection as read-only (no userId will be set on handshake)
        return callback(null, true);
      }

      var userId = socketSession.passport.user._id;

      apiClient.get('/users/' + userId, function authenticateSocketPassword(err, cReq, cRes, user) {
        if (err) {
          return callback(err.message || err.name, false);
        }

        // successfully authenticated socket connection
        handshake.userId = userId;
        handshake.username = user.displayName;
        callback(null, true);
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