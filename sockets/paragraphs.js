module.exports = function(io, db) {
  var stories = require('../data/stories.js')(db);

  io.sockets.on('connection', function(socket) {

    // don't allow anonymous users to write to stories
    if (!socket.handshake.username) {
      return socket.emit('read-only');
    }
    socket.emit('read-write');

    socket.on('add.paragraph', function(paragraph) {
      if (!(paragraph.author = socket.handshake.username)) return;

      stories.addParagraph(paragraph.storyId, paragraph, function() {
        // once added to db send paragraph to all other users to update their views of the story
        socket.broadcast.emit(paragraph.storyId, paragraph);
      });
    });

  });

};