module.exports = function(db) {

  var stories = db.collection('stories');

  return {
    getTop: getTop
  };

  function getTop(limit, callback) {
    if (typeof limit == 'function') {
      callback = limit;
      limit = 50;
    } else {
      // ensure limit is set to an acceptable value
      limit = (limit != null && limit > 0) ? limit : 50;
    }

    stories.aggregate(
      [
        { $group: { _id: '$genre', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit }
      ],
      function(err, genres) {
        if (err) console.warn(err);
        if (genres) {
          genres = genres.map(function(genre) {
            // capitalize each genre
            var name = genre._id.charAt(0).toUpperCase() + genre._id.substring(1);
            return {
              name: name,
              count: genre.count
            };
          });
        }
        callback(err, genres);
      }
    );
  }
};