module.exports = function(db) {

  var stories = db.get('stories');

  function get(limit, callback) {
    if (typeof limit != 'number') {
      callback = limit;
      limit = 50;
    }
    stories.find({}, { limit: limit, sort: [['createdDate','desc']] })
      .error(console.warn)
      .success(callback);
  }

  function getById(id, callback) {
    stories.findById(id)
      .error(console.warn)
      .success(callback);
  }

  function add(story, callback) {
    story._id = stories.id();
    story.paragraphs[0].storyId = story._id;
    story.createdDate = story.paragraphs[0].createdDate = new Date();
    story.creator = story.paragraphs[0].author = '[User]';

    stories.insert(story)
      .error(console.warn)
      .success(callback);
  }

  function addParagraph(storyId, paragraph, callback) {
    stories.updateById(storyId, { '$push': { paragraphs: paragraph } })
      .error(console.warn)
      .success(callback);
  }

  function valid(story) {
    var isValid = false;
    // TODO: implement logic for validation
    isValid = !!story.title.trim();
    return isValid;
  }

  function validParagraph(paragraph) {
    var isValid = false;
    // TODO: implement logic for validation
    isValid = !!paragraph.text.trim();
    return isValid;
  }

  return {
    get: get,
    getById: getById,
    add: add,
    addParagraph: addParagraph,
    valid: valid,
    validParagraph: validParagraph
  };

};
