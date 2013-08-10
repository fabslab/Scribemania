var uslug = require('uslug')
  , ObjectID = require('mongodb').ObjectID
  , UserError = require('../errors/user-error.js');

module.exports = function(db) {

  var stories = db.collection('stories');

  // return public functions
  return {
    get: get,
    getBySlug: getBySlug,
    getById: getById,
    add: add,
    addParagraph: addParagraph
  };

  function get(filters, limit, callback) {
    if (typeof filters == 'function') {
      callback = filters;
      filters = {};
    } else if (typeof filters == 'number') {
      limit = filters;
      callback = limit;
      filters = {};
    } else if (typeof limit == 'function') {
      callback = limit;
      limit = 50;
    }

    filters = filters || {};
    limit = limit != null ? limit : 50;

    stories
      .find(filters, { limit: limit, sort: [['createdDate','desc']] })
      .toArray(function(err, stories) {
        if (err) console.warn(err);
        callback(err, stories);
      });
  }

  function getBySlug(slug, callback) {
    stories.hint = 'slug';

    stories.findOne({ slug: slug }, function(err, story) {
      if (err) console.warn(err);
      callback(err, story);
    });
  }

  function getById(id, callback) {
    stories.findOne({ _id: id }, function(err, story) {
      if (err) console.warn(err);
      callback(err, story);
    });
  }

  function add(story, callback) {
    story._id = new ObjectID();
    story.title = story.title.trim();
    story.slug = uslug(story.title, { allowedChars: '-' });
    story.genre = story.genre.trim();
    story.paragraphs[0].storyId = story._id;
    story.stars = 0;

    story.createdDate = story.paragraphs[0].createdDate = new Date();

    if (!validStory(story)) return callback(new UserError('Invalid story.'));

    insertStory(story, callback);
  }

  function addParagraph(storyId, paragraph, callback) {
    storyId = new ObjectID(storyId);
    paragraph.text = paragraph.text.trim();

    if (!validParagraph(paragraph)) return callback(new UserError('Invalid paragraph.'));

    stories.update({ _id: storyId }, { $push: { paragraphs: paragraph } }, function(err) {
      if (err) console.warn(err);
      callback(err);
    });
  }


  // private functions

  // wrapper around inserting a story to enable retries
  function insertStory(story, callback) {
    stories.insert(story, function(err) {
      if (err) {
        if (err.code === 11000 && err.err.indexOf('slug') !== -1) {
          // duplicate key error - unique index constraint on slug has been violated
          // append a random number before trying again
          story.slug += '-' + (Math.floor(Math.random() * 10)).toString();
          insertStory(story, callback);
        } else {
          console.warn(err);
          callback(err);
        }
      }
      else {
        callback(null, story);
      }
    });
  }

  function validStory(story) {
    var validParagraphs = story.paragraphs.every(function(paragraph) {
      return validParagraph(paragraph);
    });
    return !!story.title && validParagraphs;
  }

  function validParagraph(paragraph) {
    return !!paragraph.text;
  }

};