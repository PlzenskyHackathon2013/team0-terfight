var _ = require('underscore');

var users = {}

exports.new_player = function(socket) {
    var id = _.size(users);

    users[id] = {
        'score': 0,
    }

    socket.emit("hello", {"id": id});
}