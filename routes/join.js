module.exports = function(app, api, passport) {

  app.get('/login', joinForm);
  app.get('/join', joinForm);
  app.get('/logout', logout);
  app.post('/logout', logout);

  // the first step in third-party OAuth authentication will involve redirecting
  // the user to the third-party site. after authorization, the third-party will redirect
  // the user back to this application at /auth/_provider_/callback

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email' ] }));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), authSuccess);

};

function authSuccess(req, res) {
  res.redirect('/');
}


function joinForm(req, res) {
  res.render('join');
}

function logout(req, res) {
  // clear session which causes cookie to be removed
  req.logout();
  res.redirect('/');
}