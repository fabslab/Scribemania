requirejs.config({
  paths: {
    jquery: ['http://code.jquery.com/jquery-1.10.1.min', '/vendor/jquery.min'],
    socketio: '/socket.io/socket.io.js',
    moment: '/vendor/moment',
    livestamp: '/vendor/livestamp',
    zxcvbn: '/vendor/zxcvbn'
  },
  shim: {
    zxcvbn: {
      exports: 'zxcvbn'
    }
  }
});