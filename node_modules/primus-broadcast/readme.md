## primus-broadcast

`npm install primus-broadcast`

A plugin for [primus](https://github.com/primus/primus) that adds a broadcast function to the socket/spark that excludes
the the instance you're broadcasting from, the same way it works in socket.io.

If you are using the [primus-emitter](https://github.com/cayasso/primus-emitter) plugin as well, this will favor the
.send() function over the .write() function. (You will have to pass this plugin to primus after you pass the
primus-emitter one.)

```javascript
var primusBroadcast = require('primus-broadcast');

primus.use('broadcast', primusBroadcast);

spark.on('data', function message(data) {
  // equivalent to socket.broadcast.emit() or socket.broadcast.send() in socket.io
  spark.broadcast('Received some data');
});
```

The implementation is very simple (look for yourself) but nice to have as a module.

### License

MIT
