define(function (require, exports, module) {

var Primus = require('primus');

var url = '';

var primus = new Primus(url, {
  reconnect: {
    maxDelay: Infinity, // Number: The max delay for a reconnect retry.
    minDelay: 500, // Number: The minimum delay before we reconnect.
    retries: 10 // Number: How many times should we attempt to reconnect.
  },
  strategy: ['disconnect', 'online']
});

module.exports = primus;

});
