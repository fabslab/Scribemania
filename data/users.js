var passwordUtils = require('../authentication/passwords.js');

module.exports = function(db) {

  var users = db.get('users');

  // simply checks whether a user exists and provides that user
  function get(identifier, callback) {
    // identifier used to look up the user can be a username or an email address
    users.find({ $or: [{ username: identifier }, { email: identifier }] })
    .complete(function(err, foundUsers) {
      if (err) console.warn(err);
      callback(err, foundUsers[0]);
    });
  }

  function getById(id, callback) {
    users.findById(id)
    .error(console.warn)
    .success(callback);
  }

  // authenticate a user given a username and plaintext password
  function authenticateLogin(identifier, password, callback) {
    get(identifier, function checkPassword(err, user) {
      if (err || !user) {
        return callback(err);
      }
      // check the given password against the found user's password
      passwordUtils.deriveKey(password, user.salt, function(err, derivedKey) {
        if (err) {
          callback(err);
        }
        // convert the buffer to a string
        derivedKey = derivedKey.toString('hex');
        if (passwordUtils.createHashDigest(derivedKey) === user.password) {
          // successfully matched user's credentials, return user
          callback(null, user, derivedKey);
        }
        else {
          // incorrect password supplied for the user
          callback();
        }
      });

    });
  }

  function add(user, callback) {
    user.salt = passwordUtils.createSalt();
    passwordUtils.deriveKey(user.password, user.salt, function(err, derivedKey) {
      user.password = passwordUtils.createHashDigest(derivedKey.toString('hex'));
      users.insert(user)
      .complete(function(err, user) {
        if (err) console.warn(err);
        callback(err, user, derivedKey);
      });
    });
  }

  return {
    authenticateLogin: authenticateLogin,
    get: get,
    getById: getById,
    add: add
  };

};
