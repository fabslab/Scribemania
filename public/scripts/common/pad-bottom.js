define(function (require, exports, module) {var $ = require('jquery');
module.exports = function padLastStory() {
  // using jQuery instead of plain CSS because I'm thinking of supporting IE8...
  $('.story:last-of-type').css('margin-bottom', '100px');
};
});
