var _ = require('underscore');

var users = {};
var next_id = 0;

exports.new_connection = function(socket) {
    var id = new_player(socket);

    socket.on('disconnect', _.partial(disconnect, id));
}

exports.send_info = function(socket) {
    socket.emit('users', {'number': _.size(users)});
}

function new_player(socket) {
    var id = next_id++;

    users[id] = {
        'score': 0
    };

    socket.emit("hello", {"id": id});

    return id;
}

function disconnect(id, socket) {
    users = _.omit(users, id.toString());
}
