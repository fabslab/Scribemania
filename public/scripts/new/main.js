define(function (require, exports, module) {
var $ = require('jquery');

$(function documentReady() {
  var $generateLink = $('.generate-starter');
  var $starterInput = $('#story-starter');

  $generateLink.on('click', function generateStoryStarter(event) {
    event.preventDefault();

    $.get('/starters/generate')
      .done(function insertStarter(data) {
        $starterInput.text(data);
      });
  });
});
});
