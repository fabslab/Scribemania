var express = require('express')
  , http = require('http')
  , spdy = require('spdy')
  , fs = require('fs')
  , path = require('path')
  , Primus = require('primus')
  , PrimusEmitter = require('primus-emitter')
  , primusMultiplex = require('primus-multiplex')
  , alerts = require('connect-alerts')
  , passport = require('passport')
  , restify = require('restify')
  , nconf = require('./configuration/init.js')
  , facebookAuth = require('./authentication/facebook-auth.js')
  , googleAuth = require('./authentication/google-auth.js');

// constants for paths
var routesPath = path.join(__dirname, 'routes')
  , socketsPath = path.join(__dirname, 'sockets');

var app = express();

// spdy/tls server
var spdyOptions = {
  key: fs.readFileSync(__dirname + nconf.get('certificate:key')),
  cert: fs.readFileSync(__dirname + nconf.get('certificate:cert'))
};

if (nconf.get('NODE_ENV') == 'production' && nconf.get('certificate:ca')) {
  spdyOptions.ca = fs.readFileSync(__dirname + nconf.get('certificate:ca'));
}

var server = spdy.createServer(spdyOptions, app);

// http server that just redirects to https
var httpServer = http.createServer(function httpRedirect(req, res) {
  var host = req.headers.host;
  if (host.indexOf(':')) {
    // remove port
    host = host.split(':')[0];
  }
  var url = 'https://' + host + req.url;
  var head = 'HEAD' == req.method;
  var status = 302;
  var body = '';

  // Set location header
  res.setHeader('Location', url);

  // Respond
  res.statusCode = status;
  res.setHeader('Content-Length', Buffer.byteLength(body));
  res.end(head ? null : body);
});

// websocket server
var primus = new Primus(server, {
  transformer: 'websockets'
});

// enable channels, events, and socket broadcast in primus
primus.use('emitter', PrimusEmitter);
primus.use('multiplex', primusMultiplex);

// initialize client for api
var apiClient = restify.createJsonClient({
  url: nconf.get('apiUrl'),
  // accept api's certificate for now
  rejectUnauthorized: false
});


// middleware for all environments
app.set('port', process.env.PORT || nconf.get('httpsPort'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// gzip responses
app.use(express.compress());

// serve static files
app.use(express.favicon(path.join(__dirname, 'public/images/scribemania-logo32.png')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());

// set up session support using cookies
app.use(express.cookieParser());
app.use(express.cookieSession({
  key: nconf.get('sessionKey'),
  secret: nconf.get('macKey')
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.csrf());

app.use(function(req, res, next) {
  // make username available to views
  if (req.user) {
    res.locals.user = {
      id: req.user._id,
      displayName: req.user.displayName
    };
  }
  // make csrf token available
  res.locals._csrf = req.csrfToken();
  return next();
});

app.use(alerts({
  template: path.join(__dirname, 'views/alert.jade'),
  engine: 'jade'
}));

app.use(app.router);

// set up passport authentication
facebookAuth.init(app, apiClient, passport);
googleAuth.init(app, apiClient, passport);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// load files that define routes
// this way we can add new route files without any additional setup
fs.readdirSync(routesPath).forEach(function(fileName) {
  require(path.join(routesPath, fileName))(app, apiClient, passport, primus);
});

app.get('*', pageNotFound);

function pageNotFound(req, res) {
  if (req.accepts('html')) {
    res.status(404).render('404');
  } else {
    res.send(404);
  }
}

// environment specific middleware
var envHandlers = {
  development: function() {
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
  }
};

if (envHandlers[app.settings.env]) {
  envHandlers[app.settings.env]();
}

// set up socket configuration and
// load files that attach event handlers to socket events
fs.readdirSync(socketsPath).forEach(function(fileName) {
  require(path.join(socketsPath, fileName))(primus, apiClient);
});

// generate client script for primus
primus.save(__dirname +'/public/vendor/primus.js');

// kick things off
server.listen(app.get('port'));
httpServer.listen(nconf.get('httpPort'));
console.log('Listening on port %d in %s mode.', app.get('port'), app.settings.env);