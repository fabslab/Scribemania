define(function (require, exports, module) {
var $ = require('jquery')
  , _ = require('lodash')
  , setCursor = require('set-cursor')
  , createEnterHandler = require('paragraph-enter')
  , speechRecognition = require('speech-recognition')
  , io = require('socketio');

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
    $story.find('.fa-microphone').show();

    var paragraphEnterHandler = createEnterHandler(socket);

    $paragraphInput.on('keydown', function escapeHandler(event) {
      // 27 is key code for escape key, hide the input
      if (event.which === 27) {
        $(this).blur();
      }
    }).on('focus', setCursor.bind($paragraphInput[0]))
      // look for key command to add text to story
      .on('keydown', paragraphEnterHandler)
      .on('keyup', paragraphEnterHandler);

    speechRecognition.enableSpeech();

    $(document).on('click', toggleInput);
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

  function toggleInput(event) {
    // input already open and clicked on, nothing to do
    if (event.target === $paragraphInput[0]) return;

    if (event.target === $story[0] || $.contains($story[0], event.target)) {
      // user clicked on story, open input
      $story.find('.start-writing').hide()
        .end().find('.add-paragraph').show();
      $paragraphInput.show().focus();
      return;
    }

    // user click away from story, hide input
    $paragraphInput.hide()
      .siblings('.enter-hints')
      .children('.add-paragraph').hide()
      .siblings('.start-writing').show();
  }

});
});
