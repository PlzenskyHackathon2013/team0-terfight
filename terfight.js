var _ = require('underscore');

var DIM = 1000,
    SPEED = 2,
    MAX_DISTANCE = 300,
    TOO_CLOSE = 20,
    SHOT_SPEED = 5;

var users = {},
    messages = {},
    next_id = 0,
    stones = {},
    shots = [],
    red_score = 0,
    blue_score = 0;

exports.new_connection = function(socket) {
    if (_.isEmpty(users)) {
        new_game();
    }

    var id = new_player(socket);

    socket.on('disconnect', _.partial(disconnect, id));
    socket.on('move', _.partial(move_command, id));
    socket.on('fire', _.partial(shot_command, id));
}

exports.send_info = function(socket) {
    compute_new_positions();

    socket.emit('users', {
        'number': _.size(users),
        'red_score': red_score,
        'blue_score': blue_score,
        'users': users,
        'shots': shots
    });
}

exports.update_shots = function() {
    shots = _.filter(shots, function(shot) {
        shot.x += SHOT_SPEED * Math.cos(shot.direction);
        shot.y -= SHOT_SPEED * Math.sin(shot.direction);

        if (dist(shot.x, shot.y, shot.start_x, shot.start_y) > MAX_DISTANCE) {
            return false;
        }

        if (in_stone(shot)) {
            return false;
        }

        var killed = false
        _.each(users, function(user) {
            if (shot.user != user.id &&
                dist(shot.x, shot.y, user.pos.x + correction.x, user.pos.y + correction.y) < TOO_CLOSE) {

                dead(user);

                if (users[shot.user].team == 0) {
                    red_score++;
                } else {
                    blue_score++;
                }

                killed = true;
            }
        });

        if (killed) {
            return false;
        }

        return true;
    });
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function dead(user) {
    user.pos = new_spawn_point();
}

function compute_new_positions() {
    _.each(users, function (user, id) {
        if (!_.isEmpty(messages[id])) {
            var delta = compute_delta(messages[id]);
            var new_pos = {
                'x': user.pos.x + SPEED * delta.x,
                'y': user.pos.y - SPEED * delta.y
            };
            new_pos = { x: new_pos.x+correction.x, y: new_pos.y+correction.y };
            if (!in_stone(new_pos) && !trespass(new_pos)) {
                user.pos.x += SPEED * delta.x;
                user.pos.y -= SPEED * delta.y;
            }
        }
    });

    messages = {};
}

correction = undefined;
function move_command(id, data) {
    correction = data.correction;

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
    correction = data.correction;

    var user = users[id];
    shots.push({
        'user': user.id,
        'x': user.pos.x+correction.x,
        'y': user.pos.y+correction.y,
        'start_x': user.pos.x+correction.x,
        'start_y': user.pos.y+correction.y,
        'direction': user.direction
    });
}

function in_stone(pos) {
    var ins = false;
    _.each(stones.l, function(stone) {
        var count = 0;
        for (var i = 0; i < stone.vertices; i++) {
            var n = (i+1) % stone.vertices;

            var left = (stone.l[i].x < stone.l[n].x) ? stone.l[i] : stone.l[n];
            var right = (stone.l[i].x < stone.l[n].x) ? stone.l[n] : stone.l[i];

            if (left.x < pos.x && pos.x < right.x) {
                var y = (pos.x - left.x) / (right.x - left.x) * (right.y - left.y) + left.y;

                if (y > pos.y) {
                    count++;
                }
            }
        }

        if (count % 2) {
            ins = true;
            return true;
        }
    });

    return ins;
}

function trespass(pos) {
    return pos.x < 0 || pos.y < 0 || pos.x > DIM || pos.y > DIM;
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
        'id': id,
        'pos': new_spawn_point(),
        'direction': 0,
        'team': Math.round(Math.random())
    };

    socket.emit("hello", {
        "id": id,
        "pos": users[id].pos,
        "direction": users[id].direction,
        "stones" : stones,
        "size": {
            "width": DIM,
            "height": DIM
        }
    });

    return id;
}

function disconnect(id, socket) {
    users = _.omit(users, id.toString());
}
