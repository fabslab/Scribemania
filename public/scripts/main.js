define(function (require, exports, module) {

require('./common/ajaxPrefilters');
require('./common/stars');
require('./common/alerts');
require('livestamp');

require('./start/main');
require('./summaries/main');
require('./story/main');
require('./genres/main');
require('./groups/main');

});
