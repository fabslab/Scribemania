var signature = require('cookie-signature')
  , cookie = require('cookie')
  , nconf = require('../configuration/init.js')
  , sessionKey = nconf.get('sessionKey')
  , macKey = nconf.get('macKey');

module.exports = function(primus, apiClient) {

  primus.authorize(function authorizeSocket(req, done) {
    if (!req.headers.cookie) {
      // no cookie provided but accept connection as read-only (no userId will be set on socket)
      return done();
    }

    var socketSignedSession = cookie.parse(req.headers.cookie)[sessionKey];
    var socketSessionJson = parseSignedCookie(socketSignedSession, macKey);
    if (socketSessionJson === socketSignedSession) return done('Invalid cookie.', false);

    var socketSession = parseJSONCookie(socketSessionJson);
    if (!socketSession.passport.user) {
      // user not logged in but accept connection as read-only (no userId will be set on socket)
      return done();
    }

    var userId = socketSession.passport.user.id;

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