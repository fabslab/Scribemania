var path = require('path')
  , nconf = require('nconf');

// load arguments and environment variables configuration
var config = nconf
  .argv()
  .env();

// load file configuration for the current environment
var NODE_ENV = nconf.get('NODE_ENV') || 'development';
config.file(path.join(__dirname, NODE_ENV + '-config.json'));

module.exports = config;