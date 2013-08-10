var passwordUtils = require('../authentication/password-utils.js');

module.exports = function(db) {

  var users = db.collection('users');

  // return public functions
  return {
    authenticateLogin: authenticateLogin,
    get: getByNameOrEmail,
    getById: getById,
    add: add
  };

  function getByNameOrEmail(identifier, callback) {
    // identifier used to look up the user can be a username or an email address
    users.findOne({ $or: [{ username: identifier }, { email: identifier }] }, function (err, user) {
      if (err) console.warn(err);
      callback(err, user);
    });
  }

  function getById(id, callback) {
    users.findOne({ _id: id }, function(err, user) {
      if (err) console.warn(err);
      callback(err, user);
    });
  }

  // authenticate a user given a username and plaintext password
  function authenticateLogin(identifier, password, callback) {
    getByNameOrEmail(identifier, function checkPassword(err, user) {
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
        } else {
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
      users.insert(user, function(err) {
          if (err) {
            if (err.code === 11000) {
              // Mongo error code 11000 is for duplicate key - indexes are defined on username and email
              if (err.err.indexOf('username') !== -1) {
                err = { usernameExists: true };
              } else if (err.err.indexOf('email') !== -1) {
                err = { emailExists: true };
              }
            } else {
              console.warn(err);
            }
          }
          callback(err, user, derivedKey);
        });
    });
  }

};
