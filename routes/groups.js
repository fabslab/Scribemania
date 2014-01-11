module.exports = function(params) {
  var app = params.app;

  app.get('/groups', getUserGroups);
};

function getUserGroups(req, res) {
  if (!req.user) res.redirect('/login');
  res.end('Not implemented.');
}