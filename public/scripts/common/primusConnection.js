define(function (require, exports, module) {

var Primus = require('primus');

// default port to 8000 for openshift server websocket support
var port = location.port || (location.protocol == 'http:' ? 8000 : 8443);
var url = location.protocol +'//'+ location.hostname + ':' + (location.port || port);

module.exports = new Primus(url, {
  reconnect: {
    maxDelay: Infinity, // Number: The max delay for a reconnect retry.
    minDelay: 500, // Number: The minimum delay before we reconnect.
    retries: 10 // Number: How many times should we attempt to reconnect.
  },
  strategy: ['disconnect', 'online']
});

});
