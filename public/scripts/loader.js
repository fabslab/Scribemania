requirejs.config({
  paths: {
    jquery: '../vendor/jquery',
    socketio: '/socket.io/socket.io.js'
  }
});

require(['main']);