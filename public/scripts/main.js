define(function (require, exports, module) {

require('livestamp');

require('./init/main');

var path = getPath();

// routing
if (path == '/new') {
  require(['./new/main']);
}
else if (path.indexOf('/genres') === 0) {
  require(['./genres/main']);
  if (path != '/genres') {
    require(['./summaries/main']);
  }
}
else if (path == '/groups') {
  require(['./groups/main']);
}
else if (['', '/latest', '/stories', '/starred'].indexOf(path) !== -1 || path.indexOf('/groups/') === 0) {
  require(['./summaries/main']);
}
else if (path.indexOf('/stories/') === 0) {
  require(['./story/main']);
}

function getPath() {
  var path = window.location.pathname;

  // remove trailing slashes
  if (path.slice(-1) == '/') {
    path = path.slice(0, - 1);
  }

  return path;
}

});
