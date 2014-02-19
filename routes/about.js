module.exports = function(app) {

  app.get('/about', aboutPage);

};

function aboutPage(req, res) {
  res.render('about');
}