var storiesAccess;

module.exports = function(params) {
  storiesAccess = require('../data/stories.js')(params.db);
  var io = params.socketIo;

  io.sockets.on('connection', function(socket) {

    socket.on('add.paragraph', function(paragraph) {

      // TODO: validate paragraph

      storiesAccess.addParagraph(paragraph.storyId, paragraph, function() {
        socket.emit('saved.paragraph');
        socket.broadcast.emit('broadcast.paragraph', paragraph);
      });

    });

  });

};