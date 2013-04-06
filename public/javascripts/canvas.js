window.canvas = {};
var c;

(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
  })();

window.canvas.startLoop = function($canvas) {
  window.canvas.$canvas = $canvas;
  c = window.canvas.$canvas.get(0).getContext("2d");
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

  c.strokeStyle = "#000";

  for (var i=0; i<ARROW_LENGTH; i++) {
    c.lineWidth = ARROW_WIDTH * (1-i/ARROW_LENGTH);
    c.beginPath();
    c.moveTo(x+i*Math.cos(dir), y-i*Math.sin(dir));
    c.lineTo(x+(i+1)*Math.cos(dir), y-(i+1)*Math.sin(dir));
    c.stroke();
    c.closePath();
  }
}

ROCK_DIAMETER = 20;
window.canvas.drawRock = function (c, rock, cPos) {
  c.fillStyle = "#aaa";
  c.lineWidth = 1;

  c.beginPath();

  c.moveTo(rock.l[0].x - cPos.x  + window.canvas.$canvas.width()/2,
    rock.l[0].y - cPos.y + window.canvas.$canvas.height()/2);
  for (var i=1; i<rock.l.length; i++) {
    c.lineTo(rock.l[i].x - cPos.x + window.canvas.$canvas.width()/2,
      rock.l[i].y - cPos.y + window.canvas.$canvas.height()/2);
  };

  c.closePath();
  c.fill();
  c.stroke();
}
