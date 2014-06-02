define(function (require, exports, module) {

var $ = require('jquery')
  , tabNotifications = require('../common/tabNotifications')
  , summaryTemplate = require('../templates/summary')
  , primus = require('../common/primusConnection');

var storiesSocket = primus.channel('stories');

var refreshLink = $('.refresh-latest');
var summaries = $('.summaries');
var userData = $('.init-user')[0].textContent;
userData = JSON.parse(userData);

var preloadedStories = [];

storiesSocket.on('created', function updateRefreshCounter(story) {
  preloadedStories.unshift(story);

  var current = refreshLink.text();

  current = current || 0;
  current = parseInt(current, 10) + 1;

  refreshLink.text(current);
  refreshLink.show();

  tabNotifications.increaseCount();
});

refreshLink.on('click', function(event) {
  event.preventDefault();
  event.stopPropagation();

  preloadedStories.forEach(function(story) {
    var html = summaryTemplate({ story: story, user: userData });
    summaries.prepend(html);
  });

  preloadedStories.length = 0;

  refreshLink.hide();
  refreshLink.text(0);

  tabNotifications.resetCount();
});

});
