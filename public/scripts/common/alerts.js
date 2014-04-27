define(function (require, exports, module) {
var $ = require('jquery');

$(function documentReady() {
  $('.alert').on('click', '.close', function() {
    $(this.parentNode).remove();
  });
});
});