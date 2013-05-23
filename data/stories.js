module.exports = function(db) {

  var stories = db.get('stories');

  function getAll(cb) {

    stories.find({}, {"sort": [['createdDate','desc']]})
      .success(cb)
      .error(console.warn);

  }

  function add(story, cb) {
    var now = new Date();

    story._id = stories.id();
    story.createdDate = now;
    story.paragraphs[0].storyId = story._id;
    story.paragraphs[0].createdDate = now;

    stories.insert(story)
      .success(cb)
      .error(console.warn);
  }

  function addParagraph(storyId, paragraph, cb) {

    stories.updateById(storyId, { '$push': { paragraphs: paragraph } })
      .success(cb)
      .error(console.warn);

  }

  return {
    getAll: getAll,
    add: add,
    addParagraph: addParagraph
  };

};
