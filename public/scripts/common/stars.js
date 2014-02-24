define(function (require, exports, module) {

var $ = require('jquery');

var CSRF_HEADER = 'X-CSRF-Token';

var setCSRFToken = function(securityToken) {
  $.ajaxPrefilter(function(options, _, xhr) {
    if (!xhr.crossDomain)
      xhr.setRequestHeader(CSRF_HEADER, securityToken);
  });
};

setCSRFToken($('meta[name="csrf-token"]').attr('content'));

function init() {
  $('.content').on('click', '.star-action', function() {
    var storyId = $(this).closest('.story').attr('data-story-id');
    $.post('/stories/' + storyId + '/stars')
      .done(function() {
        console.log('starred');
      });
  });
}

module.exports = { init: init };

});
