var stories;

module.exports = function(params) {
  stories = require('../data/stories.js')(params.db);
  var app = params.app;

  app.get('/stories/:id', story);
};

function story(req, res) {
  var id = req.params.id;
  var objectIdRegExp = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegExp.test(id)) res.send(404);

  stories.getById(id, function(err, doc) {
    res.render('story', { story: doc });
  });
}