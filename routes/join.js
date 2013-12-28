var restify = require('restify')
  , zxcvbn = require('../public/vendor/zxcvbn.min.js');

var apiClient = restify.createJsonClient({
  url: 'https://localhost:8080'
});

module.exports = function(params) {
  var app = params.app;

  app.get('/join', joinForm);
  app.post('/join', createUser);
};

function joinForm(req, res) {
  res.locals._csrf = req.session._csrf;
  res.render('join');
}

function createUser(req, res, next) {
  var username = req.body.username
    , email = req.body.email
    , password = req.body.password;

  // check for valid email
  var emailExp = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
  if (!emailExp.test(email)) {
    return next(new Error('Email provided is invalid.'));
  }

  // check strength of password
  // user can not have a password that is the same as their username or tokens in their email address
  var emailParts = email.split('@');
  var emailName = emailParts[0];
  var emailDomain = emailParts[1].substring(0, emailParts[1].indexOf('.'));
  var badInputs = [username, email, emailName, emailDomain];
  var passwordResult = zxcvbn(password, badInputs);

  if (passwordResult.score < 1) {
    res.alert('Password is too weak.', 'error');
    return res.redirect('/join');
  }

  var user = {
    username: username,
    password: password,
    email: email,
    favorites: []
  };

  apiClient.post('/users', user, function(err, cReq, cRes, result) {
    if (err) {
      res.alert(err.msg, 'error');
      return res.redirect('/join');
    }

    req.logIn(result.user, function(loginErr) {
      if (loginErr) {
        return next(loginErr);
      }
      // retain authenticator (derived key) here to save into cookie session
      // and check upon subsequent access
      req.session.authenticator = result.derivedKey;
      res.redirect('/');
    });
  });
}