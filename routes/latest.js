var stories;

module.exports = function(params) {
  stories = require('../data/stories.js')(params.db);
  var app = params.app;

  // home page is currently the same as the latest stories page
  app.get('/', latest);
  app.get('/latest', latest);

};

function latest(req, res) {
  stories.get(function(docs) {
    res.render('latest', { stories: docs });
  });
}