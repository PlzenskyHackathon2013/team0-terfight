window.canvas = {};

(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
  })();

window.canvas.startLoop = function($canvas) {
  window.canvas.$canvas = $canvas;
  requestAnimationFrame(function() {
    window.canvas.loop();
  });
}

window.canvas.rocks = [
    { x: 200, y: 200 },
    { x: 250, y: 200 }
  ];

window.canvas.loop = function () {
  if (typeof usersData === "undefined") {
    // data are not yet available
    requestAnimationFrame(canvas.loop);
    return;
  }

  c = window.canvas.$canvas.get(0).getContext("2d");

  c.fillStyle = "#0f0";
  c.fillRect(0, 0, window.canvas.$canvas.width(), window.canvas.$canvas.height());

  var cPos;
  for (var userId in usersData.users)
  {
    if (userId == helloData.id)
    {
      cPos = usersData.users[userId].pos;
    }
  }

  for (var userId in usersData.users)
  {
    var user = usersData.users[userId];
    window.canvas.drawAnt(c, user, cPos);
  }

  for (var i = 0; i < helloData.stones.length; i++)
  {
    var rock = helloData.stones[i];
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
  x = rock.x - cPos.x;
  y = rock.y - cPos.y;

  c.fillStyle = "#aaa";
  c.lineWidth = 1;

  c.beginPath();

  c.moveTo(rock.l[0].x, rock.l[1].y);
  for (var i=1; i<rock.l.length; i++) {
    c.lineTo(rock.l[i].x, rock.l[i].y);
  };

  c.closePath();
  c.fill();
  c.stroke();
}