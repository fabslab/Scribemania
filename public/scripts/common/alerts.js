define(function (require, exports, module) {
var $ = require('jquery');

$(function() {
  $('.alert').on('click', '.close', function() {
    $(this.parentNode).remove();
  });
});
});