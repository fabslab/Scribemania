var stories;

module.exports = function(params) {
  var app = params.app;
  stories = require('../api/stories.js')(params.db);

  app.get('/starred', getUserStarred);
};

function getUserStarred(req, res) {
  if (!req.user) res.redirect('/login');
  res.end('Not implemented.');
}