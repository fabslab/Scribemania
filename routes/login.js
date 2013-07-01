var users;

module.exports = function(params) {
  var app = params.app
    , passport = params.passport;
  users = require('../data/users.js')(params.db);

  var redirects = {
    successRedirect: '/',
    failureRedirect: '/login'
  };

  app.get('/login', loginForm);
  app.post('/login', function(req, res, next) {
    (passport.authenticate('local', redirects))(req, res, next);
  });
};

function loginForm(req, res) {
  res.render('login');
}