
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , fs = require('fs')
  , path = require('path')
  , stylus = require('stylus')
  , nib = require('nib');

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

// development only settings
app.configure('development', function(){
  app.use(express.errorHandler());
});

// Load routes - doing it this way we can add new route files without any extra work
fs.readdirSync('./routes').forEach(function(file) {
    var route = './routes/' + file.substr(0, file.indexOf('.'));
    require(route)(app);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});