var stories;

module.exports = function(params) {
  stories = require('../data/stories.js')(params.db);
  var io = params.socketIo;

  io.sockets.on('connection', function(socket) {

    socket.on('add.paragraph', function(paragraph) {
      if (!stories.validParagraph(paragraph)) {
        socket.emit('invalid.paragraph');
      }
      console.log(paragraph.text);
      stories.addParagraph(paragraph.storyId, paragraph, function() {
        socket.broadcast.emit('broadcast.paragraph', paragraph);
      });

    });

  });

};