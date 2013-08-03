var uslug = require('uslug')
  , UserError = require('../errors/user-error.js');

module.exports = function(db) {

  var stories = db.get('stories');

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

    return stories
      .find(filters, { limit: limit, sort: [['createdDate','desc']] })
      .complete(function(err, stories) {
        if (err) console.warn(err);
        callback(err, stories);
      });
  }

  function getBySlug(slug, callback) {
    stories.hint = 'slug';

    return stories.findOne({ slug: slug })
      .complete(function(err, story) {
        if (err) console.warn(err);
        callback(err, story);
      });
  }

  function getById(id, callback) {
    return stories
      .findById(id)
      .complete(function(err, story) {
        if (err) console.warn(err);
        callback(err, story);
      });
  }

  // this function is a bit different to the rest of the db access functions in
  // that it doesn't return a promise - I plan to largely rewrite the db access layer
  // when I create an http api in front of it and remove the monk dependency, replacing it
  // with the q library (for promises) and either mongo-skin or node-mongodb-native
  // for now none of the returned promises are actually used - callbacks still rule here
  function add(story, callback) {
    story._id = stories.id();
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
    paragraph.text = paragraph.text.trim();

    if (!validParagraph(paragraph)) return callback(new UserError('Invalid paragraph.'));

    return stories.updateById(storyId, { '$push': { paragraphs: paragraph } })
      .complete(function(err) {
        if (err) console.warn(err);
        callback(err);
      });
  }

  // return public functions
  return {
    get: get,
    getBySlug: getBySlug,
    getById: getById,
    add: add,
    addParagraph: addParagraph
  };


  // private functions

  // wrapper around inserting a story to enable retries
  function insertStory(story, callback) {
    stories.insert(story)
      .error(function(err) {
        if (err.code === 11000 && err.err.indexOf('slug') !== -1) {
          // duplicate key error - unique index constraint on slug has been violated
          // append a random number before trying again
          story.slug += '-' + (Math.floor(Math.random() * 10)).toString();
          insertStory(story, callback);
        } else {
          console.warn(err);
          callback(err);
        }
      })
      .success(function(story) {
        callback(null, story);
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