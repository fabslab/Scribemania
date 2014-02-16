var require = {
  // this also gives an overview of all third-party libraries being used
  paths: {
    jquery: '/vendor/jquery.min',
    'jquery.autosize': '/vendor/jquery.autosize.min',
    socketio: '/socket.io/socket.io.js',
    moment: '/vendor/moment.min',
    livestamp: '/vendor/livestamp',
    lodash: '/vendor/lodash.min'
  },
  shim: {
    'jquery.autosize': ['jquery']
  }
};