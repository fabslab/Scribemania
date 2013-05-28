define(function (require, exports, module) {
var $ = require('jquery')
  , enter = require('paragraph-enter');

$(function() {
  // Open input for user to add to story
  $('.story')
    .on('click', function(event) {
      var $story = $(this);
      // check whether the textarea is visible and show it if it isn't
      $story.off('mousedown', stopBlur).on('mousedown', stopBlur);
      $story.children('textarea').show().focus();
      $story.find('.start-writing').hide()
        .end().find('.add-paragraph').show();

      function stopBlur(event) {
        if ($(this).children('textarea').is(':visible')) {
          event.preventDefault();
          return;
        }
      }
    })
    .find('textarea')
    // look for key command to add text to story
    .on('keydown', enter)
    .on('keyup', enter)
    .on('click', function(event) {
      // stop click handler on parent
      event.stopPropagation();
    })
    // hide the input when we click away from the story
    .on('blur', function(event) {
      $(this).hide().siblings('.enter-hints')
        .children('.add-paragraph').hide()
        .end().children('.start-writing').show();
    });

});
});
