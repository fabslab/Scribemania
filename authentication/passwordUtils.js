var crypto = require('crypto');

// Password storage and sessions implemented for Scribemania are inspired
// by the following paper to create stateless session cookies:
// http://www.cl.cam.ac.uk/~sjm217/papers/protocols08cookies.pdf

// A key is created using the password and a per-user salt with an iterative key derivation function
// The HMAC of this key is stored in the cookie (using Connect signed cookies middleware)
// and a hash of the derived key is stored in the database

function deriveKey(password, salt, done) {
  // increase iterations according to current year
  var year = new Date().getFullYear().toString();
  var iterations = parseInt(year.substring(year.length - 2), 10) * 1000;

  // algorithm used here is currently SHA-1 which outputs 160 bits = 20 bytes so we indicate a key length of 20
  var keyLength = 20;

  crypto.pbkdf2(password, salt, iterations, keyLength, done);
}

function createHashDigest(key) {
  return crypto.createHash('sha256').update(key).digest('hex');
}

function createSalt() {
  return crypto.randomBytes(128).toString('base64');
}

// Connect middleware to verify a logged-in user's authenticity
function verifyAuthentication(req, res, next) {
  var user = req.user;
  if (!user) return next();
  if (user.password === createHashDigest(req.session.authenticator)) {
    res.locals.username = user.username;
    return next();
  }
  req.logOut();
  req.session = null;
  res.redirect('/login');
}

module.exports = {
  deriveKey: deriveKey,
  createHashDigest: createHashDigest,
  createSalt: createSalt,
  verifyAuthentication: verifyAuthentication
}