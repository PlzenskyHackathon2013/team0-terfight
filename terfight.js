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
    socket.on('shot', _.partial(shot_command, id));
}

exports.send_info = function(socket) {
    compute_new_positions();

    socket.emit('users', {
        'number': _.size(users),
        'users': users
    });
}

function compute_new_positions() {
    _.each(users, function (user, id, list) {
        var delta = compute_delta(messages[id]);
        user.pos.x += delta.x;
        user.pos.y += delta.y;
    });

    messages = {};
}

function move_command(id, data) {
    if (!_.has(messages, id)) {
        messages[id] = [];
    }
    messages[id].push({
        'x': Math.cos(data.direction),
        'y': Math.sin(data.direction)
    });

    users[id].direction = data.direction;
}

function shot_command(id, data) {

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
        stone.vertices = 3 + Math.floor(Math.random() * 8);
        stone.diam = Math.floor(Math.random() * 100);
        stone.center = {};
        stone.center.x = Math.floor(Math.random() * DIM);
        stone.center.y = Math.floor(Math.random() * DIM);
        for (var k = 0; k < stone.vertices; k++)
        {
            scale = 0.2 + Math.random() * 0.8;
            stone_next = {};
            stone_next.x = stone.center.x + Math.floor( stone.diam*scale*Math.sin( (k%stone.vertices) * (2*Math.PI/stone.vertices) ));
            stone_next.y = stone.center.y + Math.floor( stone.diam*scale*Math.cos( (k%stone.vertices) * (2*Math.PI/stone.vertices) ));
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
        'pos': new_spawn_point(),
        'direction': 0
    };


    socket.emit("hello", {
        "id": id,
        "pos": users[id].pos,
        "direction": users[id].direction,
        "stones" : stones
    });

    return id;
}

function disconnect(id, socket) {
    users = _.omit(users, id.toString());
}
