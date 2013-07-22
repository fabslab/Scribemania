module.exports = function(db) {

  // indexes for users collection
  var users = db.get('users');

  users.ensureIndex('email', { unique: true })
    .complete(function(err, indexName) {
      if (err) console.warn(err);
    });

  users.ensureIndex('username', { unique: true })
    .complete(function(err, indexName) {
      if (err) console.warn(err);
    });


  // indexes for `stories` collection
  var stories = db.get('stories');

  stories.ensureIndex('slug', { unique: true })
    .complete(function(err, indexName) {
      if (err) console.warn(err);
    });

  stories.ensureIndex('genre')
    .complete(function(err, indexName) {
      if (err) console.warn(err);
    });

  stories.ensureIndex('creator')
    .complete(function(err, indexName) {
      if (err) console.warn(err);
    });

};