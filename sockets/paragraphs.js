module.exports = function(io, apiClient) {

  io.sockets.on('connection', function(socket) {

    // don't allow anonymous users to write to stories
    if (!socket.handshake.username) {
      return socket.emit('read-only');
    }
    socket.emit('read-write');

    // notify other users when someone starts/finishes writing
    socket.on('type-on', function broadcastTypeStart() {
      var user = socket.handshake.username;
      if (user) socket.broadcast.emit('type-on', user);
    });

    socket.on('type-off', function broadcastTypeEnd() {
      var user = socket.handshake.username;
      if (user) socket.broadcast.emit('type-off', user);
    });

    socket.on('add.paragraph', function(paragraph) {
      // set paragraph author as username if available
      if (!(paragraph.author = socket.handshake.username)) return;

      apiClient.post('/stories/' + paragraph.storyId + '/paragraphs', paragraph, function(err, cReq, cRes, result) {
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