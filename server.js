var express = require('express')
  , bodyParser = require('body-parser')
  , compression = require('compression')
  , connect = require('connect')
  , cookieParser = require('cookie-parser')
  , cookieSession = require('cookie-session')
  , csrf = require('csurf')
  , errorHandler = require('errorhandler')
  , http = require('http')
  , favicon = require('serve-favicon')
  , serveStatic = require('serve-static')
  , serverLogger = require('morgan')
  , fs = require('fs')
  , path = require('path')
  , uglify = require('uglify-js')
  , Primus = require('primus')
  , PrimusEmitter = require('primus-emitter')
  , primusMultiplex = require('primus-multiplex')
  , alerts = require('connect-alerts')
  , passport = require('passport')
  , restify = require('restify')
  , nconf = require('./configuration/init.js')
  , facebookAuth = require('./authentication/facebook-auth.js')
  , googleAuth = require('./authentication/google-auth.js')
  , Logger = require('bunyan');

var isProductionEnv = nconf.get('NODE_ENV') == 'production';

// constants for paths
var routesPath = path.join(__dirname, 'routes')
  , socketsPath = path.join(__dirname, 'sockets');

var app = express();
var server = http.createServer(app);

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
  log: Logger.createLogger({
      name: 'scribe-api-client',
      level: isProductionEnv ? 'error' : 'trace'
  })
});


// middleware for all environments
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || nconf.get('httpPort'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// gzip responses
app.use(compression());

// serve static files
app.use(favicon(path.join(__dirname, 'public/images/scribemania-logo32.png')));
app.use(serveStatic(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set up session support using cookies
app.use(cookieParser());
app.use(cookieSession({
  keys: [nconf.get('sessionKey')],
  secret: nconf.get('macKey')
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(csrf({
  cookie: true
}));

app.use(function(req, res, next) {
  // make username available to views
  if (req.user) {
    res.locals.user = {
      id: req.user.id,
      displayName: req.user.displayName,
      groupIds: req.user.groupIds
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
    app.use(serverLogger('dev'));
    app.use(errorHandler());
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
var primusClientLocation = path.join(__dirname, 'public/vendor/primus.js');
primus.save(primusClientLocation);
fs.writeFileSync(primusClientLocation, uglify.minify(primusClientLocation).code);

// kick things off
var host = process.env.OPENSHIFT_NODEJS_IP || undefined;
server.listen(app.get('port'), host);
console.log('Listening on port %d in %s mode.', app.get('port'), app.settings.env);
