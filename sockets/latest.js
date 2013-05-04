module.exports = function(io) {
  io.sockets.on('connection', function(socket) {
    socket.on('paragraph', function(text) {
      console.log(text);
    });
  });
};