var stories;

module.exports = function(params) {
  stories = require('../data/stories.js')(params.db);
  var io = params.socketIo;

  io.sockets.on('connection', function(socket) {
    socket.on('add.paragraph', function(paragraph) {
      if (!stories.validParagraph(paragraph)) {
        socket.emit('invalid.paragraph');
      }
      stories.addParagraph(paragraph.storyId, paragraph, function() {
        // once added to db send paragraph to all other users to update their views of the story
        socket.broadcast.emit(paragraph.storyId, paragraph);
      });
    });
  });

};