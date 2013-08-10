define(function (require, exports, module) {

var $ = require('jquery');

$(function() {
  var $searchButton = $('.search-button')
    , $searchForm = $('.genre-search');

  $searchForm.on('submit', function(event) {
    event.preventDefault();
    var genre = $('.genre-search-input').val();
    window.location = '/genres/' + genre.trim();
  });

  $searchButton.on('click', function() {
    $searchForm.trigger('submit');
  });

});

});
