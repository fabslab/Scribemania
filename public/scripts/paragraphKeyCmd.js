define(function (require, exports, module) {
var io = require('socketio');
var socket = io.connect('http://localhost');

var keysDown = {
  16: false, // shift key
  13: false  // enter key
};

module.exports = function addParagraph(event) {
  if (keysDown[event.which] == null) return;

  // determine whether shift or enter key are held down
  keysDown[event.which] = event.type == 'keydown' ? true : event.type == 'keyup' ? false : keysDown[event.which];

  // when both are held down together append the user's paragraph to the story
  if (keysDown['16'] && keysDown['13']) {
    event.preventDefault();

    if (!this.value.trim()) return;

    // get the story id using the data-story-id attribute of the story container div
    // use .attr() rather than .data() because we don't want to try to convert it - it's always a string
    var storyId = $(this.parentNode).attr('data-story-id');

    // send paragraph to server
    socket.emit('add.paragraph', { author: 'Fabien', dateCreated: new Date(), storyId: storyId, text: this.value });

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

};
});
