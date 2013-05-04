define(function (require, exports, module) {
var $ = require('jquery')
  , io = require('socketio')
  , socket = io.connect('http://localhost');

var keysDown = {
  16: false, // shift key
  13: false  // enter key
};

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
  .on('keydown', addParagraphHandler)
  .on('keyup', addParagraphHandler)
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

function addParagraphHandler(event) {
  if (keysDown[event.which] == null) return;
  // determine whether shift or enter key are held down
  keysDown[event.which] = event.type == 'keydown' ? true : event.type == 'keyup' ? false : keysDown[event.which];
  // when both are held down together append the user's paragraph to the story
  if (keysDown['16'] && keysDown['13']) {
    event.stopPropagation();
    event.preventDefault();
    // send paragraph to server
    socket.emit('paragraph', this.value);
    // hide the key command hint for entering text for story
    $(this.nextSibling).fadeOut('fast');
    // dismiss and empty the input box while appending the text to the story
    $(this).fadeOut('fast', function() {
      var additionParagraph = document.createElement('p');
      additionParagraph.appendChild(document.createTextNode(this.value));
      $(additionParagraph).hide();
      this.parentNode.insertBefore(additionParagraph, this);
      $(additionParagraph).fadeIn('fast');
      this.value = '';
    });
  }
}
});
