var express = require('express')
  , http = require('http')
  , fs = require('fs')
  , path = require('path')
  , nconf = require('nconf')
  , socketio = require('socket.io');

var routesPath = './routes/'
  , socketListenersPath = './sockets/'
  , dataAccessPath = './data/';

var app = express();

// read in configuration
nconf.argv()
     .env()
     .file({ file: app.settings.env + '-config.json' });

var db = require('monk')(nconf.get('mongodb:connectionString'));


// settings and handlers for all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
// paths for static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'socket.io')));

// environment specific settings
var envHandlers = {
  development: function() {
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
  },
  production: function() {}
};
envHandlers[app.settings.env]();


// Run socket.io and Express servers on the same port
var server = http.createServer(app);
var io = socketio.listen(server);


// object to collect together references to variables
// and pass them across application files
var params = {
  app: app,
  db: db,
  socketIo: io
};

// Load files that define routes
// This way we can add new route files without any additional setup
fs.readdirSync(routesPath).forEach(function(file) {
  require(routesPath + file)(params);
});

// Load files that attach event handlers for socket events
fs.readdirSync(socketListenersPath).forEach(function(file) {
  require(socketListenersPath + file)(params);
});

// kick things off
server.listen(app.get('port'));
console.log('Listening on port %d in %s mode.', app.get('port'), app.settings.env);