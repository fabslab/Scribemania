define(function (require, exports, module) {

var $ = require('jquery')
  , speechRecognition = require('./speech-recognition');

var keysDown = {
  16: false, // shift key
  13: false  // enter key
};

function createParagraphEnterHandler(paragraphsSocket) {

  return function addParagraph(event) {

    if (keysDown[event.which] == null) return;

    // determine whether shift or enter key are held down
    keysDown[event.which] = event.type == 'keydown' ? true : event.type == 'keyup' ? false : keysDown[event.which];

    // when both are held down together append the user's paragraph to the story
    if (keysDown['16'] && keysDown['13']) {
      event.preventDefault();

      var $this = $(this);

      var paragraphText = $this.text().trim();
      // remove newlines and extra spaces
      paragraphText = paragraphText.replace(/\s+/g, ' ');
      if (!paragraphText) return;

      // get the story id using the data-story-id attribute of the story container div
      // use .attr() rather than .data() because we don't want to try to convert it - it's always a string
      var storyId = $(this.parentNode).attr('data-story-id');

      // send paragraph to server
      paragraphsSocket.send('added', { dateCreated: new Date(), storyId: storyId, text: paragraphText });

      // hide the key command hint for entering text for story
      $this
        .siblings('.enter-hints')
        .children('.add-paragraph')
        .fadeOut('fast');

      // dismiss and empty the input box before appending the text to the story
      $this.fadeOut('fast', function() {
        $this
          .text('')
          .siblings('.enter-hints')
          .children('.add-paragraph')
            .hide()
          .siblings('.start-writing')
            .show();

        insertParagraph();
      });


      // clear the microphone's transcript state
      speechRecognition.transcript = '';

      keysDown['16'] = keysDown['13'] = false;
    }

    function insertParagraph() {
      $('<p></p>')
        .hide()
        .text(paragraphText)
        .insertBefore($this)
        .fadeIn('fast')
        .siblings('.enter-hints')
        .children('.start-writing')
        .fadeIn('fast');
    }

  };

}

module.exports = createParagraphEnterHandler;

});
