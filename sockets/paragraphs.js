module.exports = function(primus, apiClient) {

  primus.on('connection', function(spark) {

    // don't allow anonymous users to write to stories
    var user = spark.remote.socket.user;
    if (!user) {
      return spark.send('read-only');
    }

    spark.send('read-write');

    // notify other users when someone starts/finishes writing
    spark.on('type-on', function broadcastTypeStart() {
      var userId = user.id;
      var username = user.username;
      if (userId) spark.broadcast('type-on', { id: userId, name: username });
    });

    spark.on('type-off', function broadcastTypeEnd() {
      var userId = user.id;
      var username = user.username;
      if (userId) spark.broadcast('type-off', { id: userId, name: username });
    });

    spark.on('add.paragraph', function(paragraph) {
      var userId = user.id;
      var username = user.username;
      if (!userId || !username) return;

      paragraph.authorId = userId;
      paragraph.authorName = username;

      apiClient.post('/stories/' + paragraph.storyId + '/paragraphs', paragraph, function(err) {
        if (err) {
          spark.send('error', err);
          return;
        }
        // once added to db send paragraph to all other users to update their view of the story
        spark.broadcast(paragraph.storyId, paragraph);
      });
    });

  });

};