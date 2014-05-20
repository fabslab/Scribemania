define(function (require, exports, module) {
var $ = require('jquery');

$(function setAlertCloseHandler() {
  $('.alert').on('click', '.close', function() {
    $(this.parentNode).remove();
  });
});
});
