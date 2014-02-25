define(function (require, exports, module) {

var $ = require('jquery')
  , stars = require('../common/stars');

// initialize live timestamps
require('livestamp');

$(function documentReady() {
  stars.init();
});

});
