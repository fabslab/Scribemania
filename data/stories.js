module.exports = function(db) {

  var stories = db.get('stories');

  function getAll(cb) {

    stories.find({}, {"sort": [['createdDate','desc']]})
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

  return {
    getAll: getAll,
    add: add,
    addParagraph: addParagraph
  };

};
