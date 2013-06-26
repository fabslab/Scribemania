module.exports = function(db) {
  var users = db.get('users');
  users.index('email', { unique: true });
  users.index('username', { unique: true });
};