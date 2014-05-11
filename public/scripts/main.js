define(function (require, exports, module) {

require('./common/ajaxPrefilters');
require('./common/stars');
require('./common/alerts');
require('livestamp');

var path = window.location.pathname;
if (path[path.length - 1] == '/') {
  path = path.substring(0, path.length - 1);
}

if (path == '/new') {
  require(['./new/main']);
}
else if (path == '/genres') {
  require(['./genres/main']);
}
else if (path == '/groups') {
  require(['./groups/main']);
}
else if (
    ['', '/latest', '/stories', '/starred'].indexOf(path) !== -1 ||
    path.indexOf('/genres/') === 0 ||
    path.indexOf('/groups/') === 0
  ) {
  require(['./summaries/main']);
}
else if (path.indexOf('/stories/') === 0) {
  require(['./story/main']);
}

});
