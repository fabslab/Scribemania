var stories;

module.exports = function(params) {
  stories = require('../data/stories.js')(params.db);
  var app = params.app;

  app.get('/stories/:id', story);
};

function story(req, res) {
  console.log(req.params.id);
  var objectIdRegExp = new RegExp("^[0-9a-fA-F]{24}$");
  if (!objectIdRegExp.test(req.params.id)) res.send("");

  stories.get(req.params.id, function(doc) {
    res.render('story', { story: doc });
  });
}