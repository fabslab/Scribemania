var express = require('express')
  , http = require('http')
  , fs = require('fs')
  , path = require('path')
  , socketio = require('socket.io');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'socket.io')));

// Development only settings
app.configure('development', function(){
  app.use(express.errorHandler());
});

// Load files that define routes
// This way we can add new route files without any additional setup
fs.readdirSync('./routes').forEach(function(file) {
  var routeModule = './routes/' + file.substr(0, file.indexOf('.'));
  require(routeModule)(app);
});

// Run socket.io and Express on the same port
var server = http.createServer(app);
var io = socketio.listen(server);

// Load files that attach event handlers for socket events
fs.readdirSync('./sockets').forEach(function(file) {
  var socketModule = './sockets/' + file.substr(0, file.indexOf('.'));
  require(socketModule)(io);
});

server.listen(app.get('port'));