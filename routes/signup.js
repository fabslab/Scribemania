var users
  , zxcvbn = require('../public/vendor/zxcvbn.js');

module.exports = function(params) {
  var app = params.app;
  users = require('../data/users.js')(params.db);

  app.get('/signup', signupForm);
  app.post('/signup', createUser);
  app.post('/name-available', checkUsernameAvailability);
};

function signupForm(req, res) {
  res.render('signup');
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
    //return next(new UserError('Password is too weak.'));
    res.alert('Password is too weak.', 'error');
    return next();
  }

  var user = {
    username: username,
    password: password,
    email: email
  };

  users.add(user, function(err, addedUser, derivedKey) {
    if (err) {
      // Mongo error code 11000 is for duplicate key - indexes are defined on username and email
      if (err.code === 11000) {
        //return next(new UserError('The username/email already exists.'));
        res.alert('The username/email already exists.', 'error');
        return res.redirect('/signup');
      }
      return next(err);
    }

    req.logIn(addedUser, function(loginErr) {
      if (loginErr) return next(loginErr);
      // retain authenticator (derived key) here to save into cookie session
      // and check upon subsequent access
      req.session.authenticator = derivedKey.toString('hex');
      return res.redirect('/');
    });
  });
}

// determines whether a username is there for the taking
function checkUsernameAvailability(req, res, next) {
  users.get(req.param('username'), function(user) {
    if (user) {
      res.alert('The name has already been taken.');
      return res.redirect('/signup');
    }
    res.send(200);
  });
}