module.exports = function(db) {
  var stories = db.get('stories');

  return {
    getAll: function(cb) {
      stories.find()
      .success(cb).error(console.warn);
    },

    add: function(story, cb) {
      story._id = stories.id();
      story.paragraphs.forEach(function(paragraph) {
        paragraph.storyId = story._id;
      });
      stories.insert(story)
      .success(cb).error(console.warn);
    },

    addParagraph: function(storyId, paragraph, cb) {
      stories.updateById(storyId, { '$push': { paragraphs: paragraph } })
      .success(cb).error(console.warn);
    }

  };

};
