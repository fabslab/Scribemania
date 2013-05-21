define(function (require, exports, module) {
var $ = require('jquery')
  , paragraphKeyCmd = require('paragraphKeyCmd');

$(function() {
  // to avoid hiding a textarea element in blur event when clicking its
  // respective story we need to store the target of the mouse click
  var mousedownTarget;
  $(document).on('mousedown', function(event) {
    mousedownTarget = event.target;
  });

  // Open input for user to add to story
  $('.story')
  .on('click', function(event) {
    var $storyEl = $(this);
    $storyEl.find('textarea').show().focus();
    $storyEl.find('.enter-hint').show();
  })
  .find('textarea')
  // look for key command to add text to story
  .on('keydown', paragraphKeyCmd)
  .on('keyup', paragraphKeyCmd)
  .on('click', function(event) {
    // stop click handler on parent
    event.stopPropagation();
  })
  // hide the input when we click away from the story
  .on('blur', function(event) {
    // if we are clicking on the containing story then keep focus
    if ($.contains(this.parentNode, mousedownTarget)) return;
    $(this).hide();
    $(this.nextSibling).hide();
  });

});
});
