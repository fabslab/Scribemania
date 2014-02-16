define(function (require, exports, module) {
var $ = require('jquery')
  , _ = require('lodash')
  , createEnterHandler = require('paragraph-enter')
  , io = require('socketio');

// load jquery plugins
require('jquery.autosize');

var socketAuthorized = new $.Deferred();
var socket = io.connect();

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

  var $story = $('.story')
    , storyId = $story.attr('data-story-id')
    , $paragraphInput = $story.find('.paragraph-input');

  $paragraphInput.autosize();

  // update the story with new paragraph whenever another user adds one
  socket.on(storyId, function(paragraph) {
    var newParagraph = document.createElement('p');
    var $newParagraph = $(newParagraph);
    newParagraph.appendChild(document.createTextNode(paragraph.text));
    $newParagraph.hide();
    $story[0].insertBefore(newParagraph, $paragraphInput[0]);
    $newParagraph.fadeIn();
  });

  socketAuthorized
    .fail(renderUnauthorized)
    .done(renderAuthorized)
    .done(typeNotifier)
    .done(typeReceiver);

  function renderUnauthorized() {
    $story.find('.login-hint').show();
  }

  function renderAuthorized() {
    $story.find('.start-writing').show();

    // open input for user to add to story
    $story.on('click', function(event) {
        // check whether the textarea for entering a new paragraph is visible and show if not
        $story.off('mousedown', stopBlur).on('mousedown', stopBlur);

        $paragraphInput.show().focus();

        $story.find('.start-writing').hide()
          .end().find('.add-paragraph').show();

        function stopBlur(event) {
          if ($paragraphInput.is(':visible')) {
            event.preventDefault();
            return;
          }
        }
      });

    $paragraphInput
      // hide the input when we click away from the story or hit escape
      .on('blur', hideInput)
      .on('keydown', function escapeHandler(event) {
        // 27 is key code for escape key, hide the input
        if (event.which === 27) {
          $(this).blur();
        }
      })
      // look for key command to add text to story
      .on('keydown', createEnterHandler(socket))
      .on('keyup', createEnterHandler(socket))
      .on('click', function(event) {
        // stop click handler on parent
        event.stopPropagation();
      });
  }

  // when the user begins typing we emit a message to notify the other users
  // that this user is typing a paragraph for the story
  // if there is a gap of 500 ms in typing we will, after that gap, emit
  // a message to notify the other users that their typing has stopped
  function typeNotifier() {
    $story.find('.paragraph-input')

      .on('input', _.debounce(function(event) {
        if (!$paragraphInput.is(':visible')) return;
        socket.emit('type-on');
      }, 500, { leading: true, trailing: false}))

      .on('input', _.debounce(function(event) {
        socket.emit('type-off');
      }, 500));
  }

  // receive messages notifying us of other users typing and display
  // the notification as they start and remove it when they finish
  function typeReceiver() {
    socket.on('type-on', function(user) {
      var usersContainer = $story.find('.typing-users');
      var typingNotification = $('<div class="' + user.id + '"><i class="icon-user"></i> ' + user.name + ' is typing...</div>');
      usersContainer[0].appendChild(typingNotification[0]);
    });
    socket.on('type-off', function(user) {
      $story.find('.' + user.id).remove();
    });
  }

});

function hideInput() {
  $(this).hide().siblings('.enter-hints')
    .children('.add-paragraph').hide()
    .siblings('.start-writing').show();
}
});