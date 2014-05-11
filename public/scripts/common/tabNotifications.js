define(function (require, exports, module) {
var Favico = require('favico');

// set up tab notifications for unread stories
var favicon = new Favico({
  animation: 'none',
  bgColor: '#2f5f2f'
});

var unreadStories = 0;

function resetCount() {
  unreadStories = 0;
  favicon.badge(0);
}

function increaseCount() {
  unreadStories += 1;
  favicon.badge(unreadStories);
}

function getCount() {
  return unreadStories;
}

module.exports = {
  increaseCount: increaseCount,
  resetCount: resetCount,
  getCount: getCount
};
});
