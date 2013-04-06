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
    c = window.canvas.$canvas.get(0).getContext("2d");
    b = window.canvas.$bg.get(0).getContext("2d");
   
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
    // background move

    // var cPos = usersData.users[helloData.id].pos;
    // backgroundPos.x += lastPos.x - cPos.x;
    // backgroundPos.y += lastPos.y - cPos.y;

    // lastPos = { x: cPos.x, y: cPos.y };

    // $("body").css("background-position", backgroundPos.x + "px " + backgroundPos.y + "px");

    // borders
    b.lineWidth = 6;
    b.fillStyle = grasspat;
    b.strokeRect(0, 0, helloData.size.width, helloData.size.height);
    b.fillRect(0, 0, helloData.size.width, helloData.size.height);
    lastPos = usersData.users[helloData.id].pos;
    backgroundPos = lastPos;
    backgroundPos.x -= b.canvas.width/2;
    backgroundPos.y -= b.canvas.height/2;

//document.title = cPos.x + " - " + cPos.y;

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
    
    if(!bgdone)
        window.canvas.bgbuild();
    bgdone = true;
    
    c.clearRect(0,0, c.canvas.width, c.canvas.height);
    var cPos = usersData.users[helloData.id].pos;
    //backgroundPos.x += lastPos.x - cPos.x;
    //backgroundPos.y += lastPos.y - cPos.y;
  
    var bPos = { x: cPos.x - c.canvas.width/2, y: cPos.y - c.canvas.height/2};
    window.canvas.$bg.css("left", -bPos.x + "px ");
    window.canvas.$bg.css("top", -bPos.y + "px ");
    lastPos = { x: cPos.x, y: cPos.y };

    //$("body").css("background-position", backgroundPos.x + "px " + backgroundPos.y + "px");



    for (var userId in usersData.users)
    {
        var user = usersData.users[userId];
        window.canvas.drawAnt(c, user, cPos);
    }

    for (var i = 0; i < usersData.shots.length; i++) {
        var shot = usersData.shots[i];
        window.canvas.drawShot(c, shot, cPos);
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
    //c.strokeStyle = "#000";
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
window.canvas.drawShot = function(c, shot, cPos) {
    x = shot.x - cPos.x + window.canvas.$canvas.width()/2;
    y = shot.y - cPos.y + window.canvas.$canvas.height()/2;

    if (x < 0 || y < 0 || x > window.canvas.$canvas.width() || y > window.canvas.$canvas.height()) {
        return;
    }

    c.beginPath();
    c.arc(x, y, 4, 0, 2*Math.PI, false);
    c.closePath();
    c.fillStyle = "red";
    c.fill();
    c.lineWidth = 2;
    c.strokeStyle = "black";
    c.stroke();
}
