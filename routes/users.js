var users
  , zxcvbn = require('../public/vendor/zxcvbn.js');

module.exports = function(params) {

  users = require('../data/users.js')(params.db);
  var app = params.app
    , passport = params.passport;

  app.get('/signup', signupForm);
  app.post('/signup', createUser);

  app.post('/name-available', checkUsernameAvailability);

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
function signupForm(req, res) {
  res.render('signup');
}

// determines whether a username is there for the taking
function checkUsernameAvailability(req, res) {
  users.get(req.param('name'), function(user) {
    if (user) res.send(400, { error: 'The username already exists.' });
    else res.send(200);
  });
}

function createUser(req, res, next) {
  var username = req.body.username
    , email = req.body.email
    , password = req.body.password;

  // check for valid email
  var emailExp = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
  if (!emailExp.test(email)) {
    // TODO: indicate error properly
    res.send(400, { error: 'Invalid email.' });
  }

  // check strength of password
  // user can not have a password that is the same as their username or tokens in their email address
  var emailParts = email.split('@');
  var emailName = emailParts[0];
  var emailDomain = emailParts[1].substring(0, emailParts[1].indexOf('.'));
  var badInputs = [username, email, emailName, emailDomain];
  var passwordResult = zxcvbn(password, badInputs);

  if (passwordResult.score < 2) {
    // TODO: indicate error properly
    res.send(400, { error: 'Password is too weak.' });
    return;
  }

  var user = {
    username: username,
    password: password,
    email: email
  };

  // TODO: check whether username or email already exist before adding user

  users.add(user, function(err, addedUser, authenticator) {
    if (err) return next(err);
    req.logIn(addedUser, function(loginErr) {
      if (loginErr) return next(loginErr);
      // retain authenticator (derived key) here to save into cookie session
      // and check upon subsequent access
      req.session.authenticator = authenticator.toString('hex');
      res.redirect('/');
    });
  });
}