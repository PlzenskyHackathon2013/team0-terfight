window.canvas = {};
var c, b;
var stonepat, grasspat;
var termite_img_r, termite_img_b;
var bgdone = false;

(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

window.canvas.startLoop = function($canvas, $bg) {
    window.canvas.$canvas = $canvas;
    window.canvas.$bg = $bg;
    window.canvas.bg = $bg.get(0);
    c = window.canvas.$canvas.get(0).getContext("2d");
   
    var stonebg = new Image();
    stonebg.src = "images/stone.jpg";
    stonebg.onload = function() {
        stonepat = c.createPattern(stonebg, "repeat");
    }
    var grassbg = new Image();
    grassbg.src = "images/grass.jpg";
    grassbg.onload = function() {
        grasspat = c.createPattern(grassbg, "repeat");
    }
     
    termite_img_r = new Image();
    termite_img_r.src = "images/termite_maly_r.png";

    termite_img_b = new Image();
    termite_img_b.src = "images/termite_maly_b.png";

    requestAnimationFrame(function() {
        window.canvas.loop();
    });
}

lastPos = { x: -1, y: -1 };
backgroundPos = { x: 0, y: 0 };

window.canvas.bgbuild = function () {
    window.canvas.bg.width = helloData.size.width;
    window.canvas.bg.height = helloData.size.height;

    b = window.canvas.$bg.get(0).getContext("2d");

    b.lineWidth = 6;
    b.fillStyle = grasspat;
    b.strokeRect(0, 0, helloData.size.width, helloData.size.height);
    b.fillRect(0, 0, helloData.size.width, helloData.size.height);

    for (var i = 0; i < helloData.stones.l.length; i++)
    {
        var rock = helloData.stones.l[i];
        window.canvas.drawRock(rock);
    }
}

window.canvas.loop = function () {
    if (typeof usersData === "undefined") {
        // data are not yet available
        requestAnimationFrame(canvas.loop);
        return;
    }
    
    if (!bgdone)
    {
        window.canvas.bgbuild();
        bgdone = true;

        requestAnimationFrame(canvas.loop);
        return;
    }
    
    c.clearRect(0, 0, c.canvas.width, c.canvas.height);
    var cPos = usersData.users[helloData.id].pos;
  
    window.canvas.$bg.css("left", -(cPos.x - c.canvas.width/2) + "px");
    window.canvas.$bg.css("top", -(cPos.y - c.canvas.height/2) + "px");

    for (var userId in usersData.users)
    {
        var user = usersData.users[userId];
        window.canvas.drawAnt(c, user, cPos);
    }

    for (var i = 0; i < usersData.shots.length; i++) {
        var shot = usersData.shots[i];
        window.canvas.drawShot(c, shot, cPos, usersData.users[shot.user]);
    }

    c.font = 'bold 50pt arial';
    c.fillStyle = "#FF0000";
    c.fillText('' + usersData.red_score, 10, 60);
    c.fillStyle = "#0000FF";
    c.fillText('' + usersData.blue_score, 10, 120);

    requestAnimationFrame(canvas.loop);
}

ARROW_LENGTH = 20;
ARROW_WIDTH = 8;
window.correction = {x:0, y:0}
window.canvas.drawAnt = function (c, user, cPos) {
    x = user.pos.x - cPos.x + window.canvas.$canvas.width()/2;
    y = user.pos.y - cPos.y + window.canvas.$canvas.height()/2;
    dir = user.direction;

    if (x < -50 || y < -50 || x > window.canvas.width+50 ||
        y > window.canvas.height+50) {
        return;
    }

    var cx = window.canvas.width / 2;
    var cy = window.canvas.height / 2;
    var width = termite_img_r.width;
    var height = termite_img_r.height;
    
    c.save();
    c.translate(x+width/2, y+height/2);
    c.rotate(-dir+Math.PI);
    if(user.team == 0) {
        c.drawImage(termite_img_r, -width/2, -height/2, width, height);
    } else {
        c.drawImage(termite_img_b, -width/2, -height/2, width, height);
    }
    c.restore();

    window.correction = fix_head(dir, width, height, x, y);
}

fix_head = function(dir, width, height) {
    var asy = { x: (1/4 + Math.cos(dir)/2) * width, y: (1/4-Math.sin(dir)/2) * height };
    asy.y += 5;
    if (Math.abs(dir-Math.PI/2) < 0.01 || Math.abs(dir - Math.PI*3/2) < 0.01) { asy.x += 14; }
    if (dir > Math.PI/2+0.01 && dir < Math.PI*3/2-0.01) { asy.x += 24; }
    return asy;
}

ROCK_DIAMETER = 20;
window.canvas.drawRock = function (rock) {
    b.fillStyle = stonepat;
    b.lineWidth = 1;

    b.beginPath();

    b.moveTo(rock.l[0].x, rock.l[0].y);
    for (var i=1; i<rock.l.length; i++) {
        b.lineTo(rock.l[i].x, rock.l[i].y);
    }

    b.closePath();
    b.fill();
    b.stroke();
}

SHOT_RADIUS = 4;
window.canvas.drawShot = function(c, shot, cPos, user) {
    x = shot.x - cPos.x + window.canvas.$canvas.width()/2;
    y = shot.y - cPos.y + window.canvas.$canvas.height()/2;

    if (x < 0 || y < 0 || x > window.canvas.$canvas.width() || y > window.canvas.$canvas.height()) {
        return;
    }

    c.beginPath();
    c.arc(x, y, 4, 0, 2*Math.PI, false);
    c.closePath();
    c.fillStyle = (user.team === 0 ? "red" : "blue");
    c.fill();
    c.lineWidth = 2;
    c.strokeStyle = "black";
    c.stroke();
}
