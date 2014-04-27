define(function (require, exports, module) {

var $ = require('jquery');

$(function documentReady() {
  var $searchForm = $('.genre-search');

  if (!$searchForm.length) return;

  var $searchButton = $searchForm.find('.search-button');

  $searchForm.on('submit', function(event) {
    event.preventDefault();
    var genre = $('.genre-search-input').val().trim();
    if (genre) {
      window.location = '/genres/' + genre;
    }
  });

  $searchButton.on('click', function() {
    $searchForm.trigger('submit');
  });

});

});
