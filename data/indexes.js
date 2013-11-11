module.exports = {

  create: function(db) {
    // indexes for users collection
    var users = db.collection('users');

    users.ensureIndex('email', { unique: true }, function(err, indexName) {
      if (err) console.warn(err);
    });

    users.ensureIndex('username', { unique: true }, function(err, indexName) {
      if (err) console.warn(err);
    });


    // indexes for `stories` collection
    var stories = db.collection('stories');

    stories.ensureIndex('slug', { unique: true }, function(err, indexName) {
      if (err) console.warn(err);
    });

    stories.ensureIndex('genre', function(err, indexName) {
      if (err) console.warn(err);
    });

    stories.ensureIndex('creator', function(err, indexName) {
      if (err) console.warn(err);
    });
  }

};