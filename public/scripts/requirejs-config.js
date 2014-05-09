var require = {
  // this also gives an overview of all third-party libraries being used
  paths: {
    jquery: '/vendor/jquery.min',
    jadeRuntime: '/vendor/jade-runtime',
    livestamp: '/vendor/livestamp',
    lodash: '/vendor/lodash.min',
    moment: '/vendor/moment.min',
    primus: '/vendor/primus',
    tokeninput: '/vendor/jquery.tokeninput'
  },
  shim: {
    'tokeninput': ['jquery']
  }
};
