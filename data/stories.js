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
    story.title = toTitleCase(story.title).substring(0, 120);

    story._id = stories.id();
    story.paragraphs[0].storyId = story._id;

    story.createdDate = story.paragraphs[0].createdDate = new Date();

    if (!validStory(story)) return callback(new UserError('Invalid story.'));

    return stories.insert(story)
    .complete(function(err) {
      if (err) console.warn(err);
      callback(err);
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

function toTitleCase(title) {
  var i, str, lowers, uppers;
  str = title.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

  // certain minor words should be left lowercase unless
  // they are the first or last words in the string
  lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
    'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
  for (i = 0; i < lowers.length; i++) {
    str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), lowers[i].toLowerCase());
  }

  // Certain words such as acronyms should be left uppercase
  uppers = ['Id', 'Tv'];
  for (i = 0; i < uppers.length; i++) {
    str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), uppers[i].toUpperCase());
  }

  return str;
}