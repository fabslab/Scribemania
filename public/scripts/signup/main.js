define(function (require, exports, module) {var $ = require('jquery');
var zxcvbn = require('zxcvbn');

$(function signupFormValidation() {
  var $submitButton = $('button[type="submit"]');
  var $passwordInput = $('#password');
  var $passwordRepeat = $('#password-repeat');

  $passwordInput.on('keyup', function() {
    var securityResult = zxcvbn(this.value);
    if (securityResult.score < 2) {
      // TODO: implement password strength meter
    }
  });

  $passwordRepeat.on('blur', function() {
    if (this.value !== $passwordInput.val()) {
      // prevent submission when password inputs don't match
      // TODO: should prevent submission rather than just click
      $submitButton.on('click', preventClick);
      // TODO: combine the two jQuery objects so don't need 2 statements
      $passwordRepeat.addClass('user-error');
      $passwordInput.addClass('user-error');
      // TODO: write message notifying user passwords don't match
    }
    else {
      $submitButton.off('click', preventClick);
      $passwordRepeat.removeClass('user-error');
      $passwordInput.removeClass('user-error');
    }
  });
});

function preventClick(e) {
  return false;
}

});
