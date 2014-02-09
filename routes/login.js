module.exports = function(app, api, passport) {
  var redirects = {
    successRedirect: '/',
    failureRedirect: '/login'
  };

  app.get('/login', loginForm);
  app.post('/login', passport.authenticate('local', redirects));

  app.post('/logout', logout);


  // the first step in Twitter authentication will involve redirecting
  // the user to twitter.com.  After authorization, the Twitter will redirect
  // the user back to this application at /auth/twitter/callback

  app.get('auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
      // TODO: redirect to page user was trying to go to if different to homepage
      res.redirect('/');
    }
  );
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