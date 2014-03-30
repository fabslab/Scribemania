define(function (require, exports, module) {

var $ = require('jquery');

// set ajax prefilter to send csrf tokens automatically
var CSRF_HEADER = 'X-CSRF-Token';

var setCSRFToken = function(securityToken) {
  $.ajaxPrefilter(function(options, _, xhr) {
    if (!xhr.crossDomain)
      xhr.setRequestHeader(CSRF_HEADER, securityToken);
  });
};

$(function setAjaxPrefilters() {
  setCSRFToken($('meta[name="csrf-token"]').attr('content'));
});

});
