var UserError = require('../errors/userError.js');

module.exports = function(db) {

  var stories = db.get('stories');

  function get(limit, callback) {
    if (typeof limit != 'number') {
      callback = limit;
      limit = 50;
    }
    return stories.find({}, { limit: limit, sort: [['createdDate','desc']] })
    .complete(function(err, stories) {
      if (err) console.warn(err);
      callback(err, stories);
    });
  }

  function getById(id, callback) {
    return stories.findById(id)
    .complete(function(err, story) {
      if (err) console.warn(err);
      callback(err, story);
    });
  }

  function add(story, callback) {
    // set titles to "Title Case" and set a max character length for the title
    story.title = story.title.trim();
    story.genre = story.genre.trim();

    story._id = stories.id();
    story.paragraphs[0].storyId = story._id;

    story.createdDate = story.paragraphs[0].createdDate = new Date();

    if (!validStory(story)) return callback(new UserError('Invalid story.'));

    return stories.insert(story)
    .complete(function(err, story) {
      if (err) console.warn(err);
      callback(err, story);
    });
  }

  function addParagraph(storyId, paragraph, callback) {
    paragraph.text = paragraph.text.trim();

    if (!validParagraph(paragraph)) return callback(new UserError('Invalid paragraph.'));

    return stories.updateById(storyId, { '$push': { paragraphs: paragraph } })
    .complete(function(err) {
      if (err) console.warn(err);
      callback(err);
    });
  }

  return {
    get: get,
    getById: getById,
    add: add,
    addParagraph: addParagraph
  };

};

function validStory(story) {
  var validParagraphs = story.paragraphs.every(function(paragraph) {
    return validParagraph(paragraph);
  });
  return !!story.title && validParagraphs;
}

function validParagraph(paragraph) {
  return !!paragraph.text;
}