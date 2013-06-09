module.exports = function(db) {

  var users = db.get('users');

  function encryptPassword(password) {
    // TODO: encrypt password
    return password;
  }

  function get(name, password, cb) {
    password = encryptPassword(password);
    var findParams = {
      _id: name,
      password: password
    };
    users.find(findParams)
      .success(cb)
      .error(console.warn);
  }

  function add(user, cb) {
    user.password = encryptPassword(user.password);
    users.insert(user)
      .success(cb)
      .error(console.warn);
  }

  return {
    get: get,
    add: add
  };

};
