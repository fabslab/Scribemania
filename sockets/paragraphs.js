module.exports = function(primus, apiClient) {

  var paragraphs = primus.channel('paragraphs');

  paragraphs.on('connection', function(spark) {

    // don't allow anonymous users to write to stories
    var user = spark.remote.socket.user;
    if (!user) {
      return spark.send('read-only');
    }

    spark.send('read-write');

    var userId = user.id;
    var username = user.username;

    // notify other users when someone starts/finishes writing
    spark.on('type-on', function broadcastTypeStart() {
      if (!user) return;
      paragraphs.forEach(function broadcast(socket, id) {
        if (id != spark.id) socket.send('type-on', { id: userId, name: username });
      });
    });

    spark.on('type-off', function broadcastTypeEnd() {
      if (!user) return;
      paragraphs.forEach(function broadcast(socket, id) {
        if (id != spark.id) socket.send('type-off', { id: userId, name: username });
      });
    });

    spark.on('added', function(paragraph) {
      if (!user) return;

      paragraph.authorId = userId;
      paragraph.authorName = username;

      apiClient.post('/stories/' + paragraph.storyId + '/paragraphs', paragraph, function(err) {
        if (err) {
          spark.send('error', err);
          return;
        }
        // once added to db send paragraph to all other users to update their view of the story
        paragraphs.forEach(function broadcast(socket, id) {
          if (id != spark.id) socket.send(paragraph.storyId, paragraph);
        });
      });
    });

  });

};