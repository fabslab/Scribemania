var express = require('express')
  , http = require('http')
  , fs = require('fs')
  , path = require('path')
  , mongo = require('mongodb')
  , socketio = require('socket.io')
  , alerts = require('connect-alerts')
  , passport = require('passport')
  , verifyAuth = require('./authentication/verify.js')
  , nconf = require('./configuration/init.js');

// constants for paths
var routesPath = path.join(__dirname, 'routes')
  , socketsPath = path.join(__dirname, 'sockets');

// run socket.io and Express servers on the same port
var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);


// middleware for all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.compress());

// serve static files
app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'socket.io')));

app.use(express.bodyParser());
app.use(express.methodOverride());

// set up session support using cookies
app.use(express.cookieParser());
app.use(express.cookieSession({
  key: nconf.get('sessionKey'),
  secret: nconf.get('macKey')
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(verifyAuth);

app.use(alerts({
  template: path.join(__dirname, 'views/alert.jade'),
  engine: 'jade'
}));

app.use(app.router);

// environment specific middleware
var envHandlers = {
  development: function() {
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
  },
  production: function() {}
};
envHandlers[app.settings.env]();


// connect to database
var dbURL = nconf.get('mongodb:connectionString');
mongo.MongoClient.connect(dbURL, function runServerAfterDBConnection(err, db) {
  if (err) {
    console.warn(err);
    throw err;
  }

  // create indexes
  require('./data/indexes.js')(db);

  // set up passport authentication module
  require('./authentication/setup.js')(app, db, passport);

  var routesParams = {
    app: app,
    db: db,
    passport: passport,
    socketIo: io
  };

  // load files that define routes
  // this way we can add new route files without any additional setup
  fs.readdirSync(routesPath).forEach(function(fileName) {
    require(path.join(routesPath, fileName))(routesParams);
  });

  // set up socket.io configuration and
  // load files that attach event handlers for socket events
  fs.readdirSync(socketsPath).forEach(function(fileName) {
    require(path.join(socketsPath, fileName))(io, db);
  });


  // kick things off
  server.listen(app.get('port'));
  console.log('Listening on port %d in %s mode.', app.get('port'), app.settings.env);
});