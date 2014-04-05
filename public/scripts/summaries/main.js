define(function (require, exports, module) {

var $ = require('jquery')
  , primus = require('../common/primusConnection');

var storiesSocket = primus.channel('stories');

var $refreshLink = $('.refresh-latest');

storiesSocket.on('created', function updateRefreshCounter() {
  $refreshLink.show();

  var current = $refreshLink.text();

  if (current === '') {
    current = 1;
  } else {
    current = parseInt(current, 10) + 1;
  }

  $refreshLink.text(current);
});


});
