module.exports = function(params) {
  var app = params.app;

  app.get('/users/:username', user);
};

function user(req, res) {
  res.render('user');
}