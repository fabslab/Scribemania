module.exports = function(params) {
  var app = params.app;

  app.get('/starred', getUserStarred);
};

function getUserStarred(req, res) {
  if (!req.user) res.redirect('/login');
  res.end('Not implemented.');
}