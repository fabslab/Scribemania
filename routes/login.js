module.exports = function(app, api, passport) {
  var redirects = {
    successRedirect: '/',
    failureRedirect: '/login'
  };

  var loginHandler = passport.authenticate('local', redirects);

  app.get('/login', loginForm);
  app.post('/login', loginHandler);

  app.post('/logout', logout);
};

function loginForm(req, res) {
  res.locals._csrf = req.session._csrf;
  res.render('login');
}

function logout(req, res) {
  // clear session which causes cookie to be removed
  req.session = null;
  res.redirect('/');
}