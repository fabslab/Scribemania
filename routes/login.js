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

  app.get('/logout', logout);
  app.post('/logout', logout);
};

function loginForm(req, res) {
  res.render('login');
}

function logout(req, res) {
  // clear session which causes cookie to be removed
  req.session = null;
  res.redirect('/');
}