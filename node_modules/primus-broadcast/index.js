module.exports = {
  server: function (primus) {
    var Spark = primus.Spark;
    var send = Spark.prototype.write;

    // favor primus-emitter function if available
    if (typeof Spark.prototype.send == 'function') {
      send = Spark.prototype.send;
    }

    Spark.prototype.broadcast = function broadcast() {
      var args = arguments;
      primus.forEach(function forEach(socket, id) {
        // exclude self when sending
        if (id !== this.id) {
          send.apply(socket, args);
        }
      }.bind(this));
    };

  }
};