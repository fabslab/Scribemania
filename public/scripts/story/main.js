define(function (require, exports, module) {
var $ = require('jquery')
  , debounce = require('../common/debounce')
  , primus = require('../common/primusConnection')
  , setCursor = require('./set-cursor')
  , createEnterHandler = require('./paragraph-enter')
  , speechRecognition = require('./speech-recognition');

var socketAuthorized = new $.Deferred();

var paragraphsSocket = primus.channel('paragraphs');

primus.on('error', function(err) {
  socketAuthorized.reject(err.message);
});

// the following event is emitted after a successful connection
// and tell us whether can contribute to the given story
// they must be logged in and have write access
paragraphsSocket.on('write-access', function(access) {
  access ? socketAuthorized.resolve() : socketAuthorized.reject();
});

$(function documentReady() {

  var $story = $('.story').not('.preview');

  if (!$story.length) return;

  var storyId = $story.attr('data-story-id');
  var $paragraphInput = $story.find('.paragraph-input');

  // update the story with new paragraph whenever another user adds one
  paragraphsSocket.on(storyId, function(paragraph) {
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

  function renderJoinGroup() {
    $story.find('.join-group').show();
  }

  function renderAuthorized() {
    var userData = $('.init-user').text();
    if (userData) {
      // check whether user has access to group
      var groupId = $('.story').attr('data-group-id');
      userData = JSON.parse(userData);
      if (userData.groupIds.indexOf(groupId) < 0) {
        return renderJoinGroup();
      }
    } else {
      return renderUnauthorized();
    }

    $story.find('.start-writing').show();
    $story.find('.fa-microphone').show();

    var paragraphEnterHandler = createEnterHandler(paragraphsSocket);

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

      .on('input', debounce(function(event) {
        if (!$paragraphInput.is(':visible')) return;
        paragraphsSocket.send('type-on');
      }, 500, { leading: true, trailing: false}))

      .on('input', debounce(function(event) {
        paragraphsSocket.send('type-off');
      }, 500));
  }

  var typingUsers = {};
  var usersContainer = $story.find('.typing-users');

  // receive messages notifying us of other users typing and display
  // the notification as they start and remove it when they finish
  function typeReceiver() {
    paragraphsSocket.on('type-on', function(user) {
      typingUsers[user.id] = user;
      displayTypingUsers();
    });
    paragraphsSocket.on('type-off', function(user) {
      delete typingUsers[user.id];
      displayTypingUsers();
    });
  }

  function displayTypingUsers() {
    var message = createTypingUsersMessage(typingUsers);
    var typingNotification = $('<div><i class="icon-user"></i> ' + message + '</div>');
    usersContainer.html(typingNotification);
  }

  function createTypingUsersMessage(typingUsers) {
    var message = '', names;
    var userIds = Object.keys(typingUsers);

    if (userIds.length < 1) return message;

    if (userIds.length > 4) {
      message = 'Several people are';
    } else {
      names = userIds.map(function(id) {
        return typingUsers[id].name;
      });
      message = names.join(', ');

      if (userIds.length === 1) {
        message += ' is';
      } else {
        message += ' are';
      }
    }

    message += ' typing.';

    return message;
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
