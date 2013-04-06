window.canvas = {};
var c;
var stonepat;
var termite_img;

(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

window.canvas.startLoop = function($canvas) {
    window.canvas.$canvas = $canvas;
    c = window.canvas.$canvas.get(0).getContext("2d");

    var stonebg = new Image();
    stonebg.src = "images/stone.jpg";
    stonebg.onload = function() {
        stonepat = c.createPattern(stonebg, "no-repeat");
    }
 
    termite_img = new Image();
    termite_img.src = "images/termite_maly.png";

    requestAnimationFrame(function() {
        window.canvas.loop();
    });
}

lastPos = { x: -1, y: -1 };
backgroundPos = { x: 0, y: 0 };

window.canvas.loop = function () {
    if (typeof usersData === "undefined") {
        // data are not yet available
        requestAnimationFrame(canvas.loop);
        return;
    }

    c.clearRect(0,0, c.canvas.width, c.canvas.height);

    // background move
    var cPos = usersData.users[helloData.id].pos;
    backgroundPos.x += lastPos.x - cPos.x;
    backgroundPos.y += lastPos.y - cPos.y;

    lastPos = { x: cPos.x, y: cPos.y };

    $("body").css("background-position", backgroundPos.x + "px " + backgroundPos.y + "px");


    // borders
    c.lineWidth = 6;
    c.strokeRect(-cPos.x+c.canvas.width/2, -cPos.y+c.canvas.height/2, helloData.size.width, helloData.size.height);
    document.title = cPos.x + " - " + cPos.y;


    for (var userId in usersData.users)
    {
        var user = usersData.users[userId];
        window.canvas.drawAnt(c, user, cPos);
    }

    for (var i = 0; i < helloData.stones.l.length; i++)
    {
        var rock = helloData.stones.l[i];
        window.canvas.drawRock(c, rock, cPos);
    }

    requestAnimationFrame(canvas.loop);
}

ARROW_LENGTH = 20;
ARROW_WIDTH = 8;
window.canvas.drawAnt = function (c, user, cPos) {
    x = user.pos.x - cPos.x + window.canvas.$canvas.width()/2;
    y = user.pos.y - cPos.y + window.canvas.$canvas.height()/2;
    dir = user.direction;

    if (x < -50 || y < -50 || x > window.canvas.width+50 ||
        y > window.canvas.height+50) {
    console.log(x + ", " + y);
    return;
    }

    var cx = window.canvas.width / 2;
    var cy = window.canvas.height / 2;
    var width = termite_img.width;
    var height = termite_img.height;
    
    c.save();
    c.translate(x+width/2, y+height/2);
    c.rotate(-dir+Math.PI);
    c.drawImage(termite_img, -width/2, -height/2, width, height);
    c.restore();
    //c.strokeStyle = "#000";
}

ROCK_DIAMETER = 20;
window.canvas.drawRock = function (c, rock, cPos) {
    // do we need to draw this?
    to_draw = false;
    for (var i=0; i<rock.l.length; i++)
    {
        v = rock.l[i];
        if (v.x > -50 || v.y > -50 || v.x < window.canvas.width+50 ||
                    v.y < window.canvas.height+50) {
            to_draw = true;
        }
    }
    if (!to_draw) {
        return;
    }

    // ok, let's do it
    c.fillStyle = stonepat;
    c.lineWidth = 1;

    c.beginPath();

    c.moveTo(rock.l[0].x - cPos.x    + window.canvas.$canvas.width()/2,
        rock.l[0].y - cPos.y + window.canvas.$canvas.height()/2);
    for (var i=1; i<rock.l.length; i++) {
        c.lineTo(rock.l[i].x - cPos.x + window.canvas.$canvas.width()/2,
            rock.l[i].y - cPos.y + window.canvas.$canvas.height()/2);
    };

    c.closePath();
    c.fill();
    c.stroke();
}
