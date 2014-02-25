define(function (require, exports, module) {

var $ = require('jquery');

// TODO: move ajax prefilter to a setup file

var CSRF_HEADER = 'X-CSRF-Token';

var setCSRFToken = function(securityToken) {
  $.ajaxPrefilter(function(options, _, xhr) {
    if (!xhr.crossDomain)
      xhr.setRequestHeader(CSRF_HEADER, securityToken);
  });
};

setCSRFToken($('meta[name="csrf-token"]').attr('content'));



function init() {
  $('.content').on('click', '.star-action', function incrementStar(event) {
    event.preventDefault();
    event.stopPropagation();

    var $starAction = $(this);
    var $storyElement = $starAction.closest('.story');
    var storyId = $storyElement.attr('data-story-id');

    var $starNumberElement = $storyElement.find('.star-number');
    var oldNum = $starNumberElement.text();
    oldNum = parseInt(oldNum, 10);
    var newNum, postMethod;

    var $starIcon = $starAction.find('.fa');
    if ($starIcon.hasClass('user-starred')) {
      // remove star
      $starIcon
        .removeClass('user-starred')
        .removeClass('fa-star')
        .addClass('fa-star-o');
      newNum = oldNum - 1;

      $.post('/stories/' + storyId + '/stars/destroy')
        .fail(function undoIncrement() {
          // if request to the server fails, undo increment on client
          $starNumberElement.text(oldNum);

          $starIcon
            .removeClass('fa-star-o')
            .addClass('fa-star')
            .addClass('user-starred');
        });
    } else {
      // add star
      $starIcon
        .removeClass('fa-star-o')
        .addClass('fa-star')
        .addClass('user-starred');
      newNum = oldNum + 1;

      $.post('/stories/' + storyId + '/stars/create')
        .fail(function undoIncrement() {
          // if request to the server fails, undo increment on client
          $starNumberElement.text(oldNum);

          $starIcon
            .removeClass('user-starred')
            .removeClass('fa-star')
            .addClass('fa-star-o');
        });
    }

    // assume request will be successful and update number now
    $starNumberElement.text(newNum);
  });
}

module.exports = { init: init };

});
