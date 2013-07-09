requirejs.config({
  paths: {
    jquery: ['http://code.jquery.com/jquery-1.10.1.min', '/vendor/jquery.min'],
    socketio: '/socket.io/socket.io.js',
    moment: '/vendor/moment.min',
    livestamp: '/vendor/livestamp',
    zxcvbn: '/vendor/zxcvbn.min',
    lodash: '/vendor/lodash.min'
  },
  shim: {
    zxcvbn: {
      exports: 'zxcvbn'
    }
  }
});