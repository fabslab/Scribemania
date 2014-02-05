var passwordUtils = require('./password-utils.js');

module.exports = function verifyAuthentication(req, res, next) {
  // Connect middleware to verify a logged-in user's authenticity
  var user = req.user;
  if (!user) return next();

  if (passwordUtils.createHashDigest(req.session.authenticator) === user.password) {
    res.locals.username = user.username;
    return next();
  }
  req.logOut();
  req.session = null;
  res.redirect('/login');
};