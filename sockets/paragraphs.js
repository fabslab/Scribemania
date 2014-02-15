module.exports = function(io, apiClient) {

  io.sockets.on('connection', function(socket) {

    // don't allow anonymous users to write to stories
    if (!socket.handshake.username) {
      return socket.emit('read-only');
    }
    socket.emit('read-write');

    // notify other users when someone starts/finishes writing
    socket.on('type-on', function broadcastTypeStart() {
      var userId = socket.handshake.userId;
      var username = socket.handshake.username;
      if (userId) socket.broadcast.emit('type-on', username);
    });

    socket.on('type-off', function broadcastTypeEnd() {
      var userId = socket.handshake.userId;
      var username = socket.handshake.username;
      if (userId) socket.broadcast.emit('type-off', username);
    });

    socket.on('add.paragraph', function(paragraph) {
      var userId = socket.handshake.userId;
      var username = socket.handshake.username;
      if (!userId || !username) return;

      paragraph.authorId = userId;
      paragraph.authorName = username;

      apiClient.post('/stories/' + paragraph.storyId + '/paragraphs', paragraph, function(err) {
        if (err) {
          socket.emit('error', err);
          return;
        }
        // once added to db send paragraph to all other users to update their view of the story
        socket.broadcast.emit(paragraph.storyId, paragraph);
      });
    });

  });

};