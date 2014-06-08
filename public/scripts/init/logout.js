define(function (require, exports, module) {
var $ = require('jquery');

$(function setLogoutHandler() {
  $('.user-logout').on('click', function(event) {
    event.preventDefault();
    $.post('/logout').done(function() {
      window.location.reload();
    });
  });
});
});
