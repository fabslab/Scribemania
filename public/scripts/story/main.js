define(function (require, exports, module) {
var $ = require('jquery')
  , createEnterHandler = require('paragraph-enter')
  , io = require('socketio')
  , socketAuthorized = new $.Deferred()
  , socket = io.connect();

socket.on('error', function(reason) {
  socketAuthorized.reject(reason);
});
// the following events are emitted after a successful connection
// and tell us whether the user is anonymous (not logged in) and has only
// read capabilities or is fully authenticated and can also write
socket.on('read-only', function(reason) {
  socketAuthorized.reject(reason);
});
socket.on('read-write', function() {
  socketAuthorized.resolve();
});

// initialize live timestamps
  require('livestamp');

$(function() {

  var $story = $('.story');
  var storyId = $story.attr('data-story-id');

  // update the story with new paragraph whenever another user adds one
  socket.on(storyId, function(paragraph) {
    var newParagraph = document.createElement('p');
    var $newParagraph = $(newParagraph);
    newParagraph.appendChild(document.createTextNode(paragraph.text));
    $newParagraph.hide();
    $story[0].insertBefore(newParagraph, document.getElementById('paragraph-input'));
    $newParagraph.fadeIn();
  });

  socketAuthorized
  .fail(renderUnauthorized)
  .done(renderAuthorized);

  function renderUnauthorized() {
    $story.find('.login-hint').show();
  }

  function renderAuthorized() {
    $story.find('.start-writing').show();

    // Open input for user to add to story
    $story
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
    .find('#paragraph-input')
    // look for key command to add text to story
    .on('keydown', createEnterHandler(socket))
    .on('keyup', createEnterHandler(socket))
    .on('click', function(event) {
      // stop click handler on parent
      event.stopPropagation();
    })
    // hide the input when we click away from the story or hit escape
    .on('blur', hideInput)
    .on('keydown', function escapeHandler(event) {
      // 27 is key code for escape key
      if (event.which === 27) {
        hideInput.call(this, event);
      }
    });
  }

});

function hideInput(event) {
  $(this).hide().siblings('.enter-hints')
  .children('.add-paragraph').hide()
  .siblings('.start-writing').show();
}
});