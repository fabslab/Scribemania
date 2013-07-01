var express = require('express')
  , http = require('http')
  , fs = require('fs')
  , path = require('path')
  , nconf = require('nconf')
  , socketio = require('socket.io')
  , alerts = require('connect-alerts')
  , passport = require('passport')
  , passwordUtils = require('./authentication/passwordUtils.js');

var routesPath = './routes/'
  , socketListenersPath = './sockets/';

var app = express();

// read in configuration
nconf.argv()
     .env()
     .file({ file: app.settings.env + '-config.json' });

// connect to database
var db = require('monk')(nconf.get('mongodb:connectionString'));
// create indexes
require('./data/indexes.js')(db);


// settings and handlers for all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.compress());

// paths for static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'socket.io')));
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));

app.use(express.bodyParser());
app.use(express.methodOverride());

// set up session support using cookies
app.use(express.cookieParser());
app.use(express.cookieSession({
  key: 'scribe.sess',
  secret: nconf.get('macKey')
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passwordUtils.verifyAuthentication);

app.use(alerts({
  template: __dirname + './views/alert.jade',
  engine: 'jade'
}));

app.use(app.router);



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
// and pass them across different application files
var params = {
  app: app,
  db: db,
  socketIo: io,
  passport: passport
};

// set up Passport authentication module
require('./authentication/setup.js')(params);

// Load files that define routes
// This way we can add new route files without any additional setup
fs.readdirSync(routesPath).forEach(function(fileName) {
  require(routesPath + fileName)(params);
});

// Load files that attach event handlers for socket events
fs.readdirSync(socketListenersPath).forEach(function(fileName) {
  require(socketListenersPath + fileName)(params);
});

// kick things off
server.listen(app.get('port'));
console.log('Listening on port %d in %s mode.', app.get('port'), app.settings.env);