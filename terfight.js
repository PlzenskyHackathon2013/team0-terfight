var _ = require('underscore');

var users = {};
var messages = {};
var next_id = 0;

exports.new_connection = function(socket) {
    if (_.isEmpty(users)) {
        new_game();
    }

    var id = new_player(socket);

    socket.on('disconnect', _.partial(disconnect, id));
    socket.on('move', _.partial(move_command, id));
}

exports.send_info = function(socket) {
    socket.emit('users', {
        'number': _.size(users),
        'positions': compute_new_positions()
    });
}

function compute_new_positions() {
    var positions = {};

    _.each(users, function (user, id, list) {
        var delta = compute_delta(messages[id]);
        positions[id] = {
            'x': user.pos.x + delta.x,
            'y': user.pos.y + delta.y
        }

        users[id].pos = positions[id];
    });

    messages = {};

    return positions;
}

function move_command(id, data) {
    if (!_.has(messages, id)) {
        messages[id] = [];
    }
    messages[id].push({
        'x': Math.cos(data.direction),
        'y': Math.sin(data.direction)
    });
}

function compute_delta(messages) {
    return _.reduce(messages, function(memo, msg) {
        return {
            'x': memo.x + msg.x,
            'y': memo.y + msg.y
        };
    }, {'x': 0, 'y': 0});
}

function new_game() {
    // TODO
}

function new_spawn_point() {
    return {'x': 5000, 'y': 5000};
}

function new_player(socket) {
    var id = next_id++;

    users[id] = {
        'score': 0,
        'pos': new_spawn_point()
    };

    socket.emit("hello", {
        "id": id,
        "pos": users[id].pos
    });

    return id;
}

function disconnect(id, socket) {
    users = _.omit(users, id.toString());
}
