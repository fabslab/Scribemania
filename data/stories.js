module.exports = function(db) {

  var stories = db.get('stories');

  function get(limit, cb) {
    if (typeof limit != 'number') {
      cb = limit;
      limit = 50;
    }
    stories.find({}, {"limit": limit, "sort": [['createdDate','desc']]})
      .success(cb)
      .error(console.warn);
  }

  function getById(id, cb) {
    stories.findById(id)
      .success(cb)
      .error(console.warn);
  }

  function add(story, cb) {
    story._id = stories.id();
    story.paragraphs[0].storyId = story._id;
    story.createdDate = story.paragraphs[0].createdDate = new Date();
    story.creator = story.paragraphs[0].author = '[User]';

    stories.insert(story)
      .success(cb)
      .error(console.warn);
  }

  function addParagraph(storyId, paragraph, cb) {
    stories.updateById(storyId, { '$push': { paragraphs: paragraph } })
      .success(cb)
      .error(console.warn);
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
