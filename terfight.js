var _ = require('underscore');

var DIM = 10000;
var users = {};
var messages = {};
var next_id = 0;
var stones = {};

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

// TODO: fix stones collisions
// TODO: make stones not intersect with the edges of the screen, maybe.
function new_game() {
    stones.no = Math.floor(Math.random() * 30);
    stones.l = [];
    var stone;
    var scale; 
    for (var j = 0; j < stones.no; j++)
    {
        stone = {};
        stone.l = [];
        stone.vertices = Math.floor(Math.random() * 10);
        stone.diam = Math.floor(Math.random() * 100);
        stone.center = {};
        stone.center.x = Math.floor(Math.random() * DIM);
        stone.center.y = Math.floor(Math.random() * DIM);
        for (var k = 0; k < stone.dimension; k++)
        {
            scale = Math.floor(0.2 + Math.random() * 0.8);
            stone_next = {};
            stone_next.x = stone.center.x + stone.diam*scale*Math.sin( (k%stone.dimension) * (Math.PI/k) );
            stone_next.y = stone.center.y + stone.diam*scale*Math.cos( (k%stone.dimension) * (Math.PI/k) );
            stone.l.push(stone_next);
        }
        stones.l.push(stone);
    }

}

function new_spawn_point() {
    var p = {};
    p.x = Math.floor(Math.random() * DIM);
    p.y = Math.floor(Math.random() * DIM);
    return p; 
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
