define(function (require, exports, module) {

var Primus = require('primus');

// override port to 8000 for openshift server support
var url = location.origin;
var port = location.protocol == "http" ? 8000 : 8443;
if (!url) {
  url = location.protocol +'//'+ location.hostname;
}
url = url.split(':')[0] + ':' + port;

module.exports = new Primus(url, {
  reconnect: {
    maxDelay: Infinity, // Number: The max delay for a reconnect retry.
    minDelay: 500, // Number: The minimum delay before we reconnect.
    retries: 10 // Number: How many times should we attempt to reconnect.
  },
  strategy: ['disconnect', 'online']
});

});
