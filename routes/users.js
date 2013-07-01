var users;

module.exports = function(params) {
  var app = params.app;
  users = require('../data/users.js')(params.db);

  app.get('/users/:username', user);
};

function user(req, res) {
  res.render('user');
}