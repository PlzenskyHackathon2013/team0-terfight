window.canvas = {}

window.canvas.startLoop = function(c) {
  window.canvas.domElement = c;
  requestAnimationFrame(function() {
    window.canvas.loop();
  });
}

window.canvas.rocks = [
    { x: 200, y: 200 },
    { x: 250, y: 200 }
  ];

window.canvas.loop = function () {
  c = window.canvas.domElement.getContext("2d");

  c.fillStyle = "#0f0";
  c.fillRect(0, 0, 500, 300);

  for (var i = 0; i < main.getAnts().length; i++)
  {
    var ant = main.getAnts()[i];
    window.canvas.drawAnt(c, ant.x, ant.y, ant.dir);
  }

  for (var i = 0; i < canvas.rocks.length; i++)
  {
    var rock = canvas.rocks[i];
    window.canvas.drawRock(c, rock);
  }

  requestAnimationFrame(canvas.loop);
}

ARROW_LENGTH = 20;
ARROW_WIDTH = 8;
window.canvas.drawAnt = function (c, x, y, dir) {
  c.strokeStyle = "#000";
  
  for (var i=0; i<ARROW_LENGTH; i++) {
    c.lineWidth = ARROW_WIDTH * (1-i/ARROW_LENGTH);
    c.beginPath();
    c.moveTo(x+i*Math.sin(dir), y+i*Math.cos(dir));
    c.lineTo(x+(i+1)*Math.sin(dir), y+(i+1)*Math.cos(dir));
    c.stroke();
    c.closePath();
  }
}

ROCK_DIAMETER = 20;
window.canvas.drawRock = function (c, rock) {
  c.fillStyle = "#aaa";
  c.lineWidth = 1;

  c.beginPath();

  if (!rock.rndList) {
    rock.rndList = {};
    for (var i=0; i<6; i++) {
      rock.rndList[i] = 0.2+Math.random()*0.8;
    };
  }

  c.moveTo(rock.x+ROCK_DIAMETER*rock.rndList[i]*Math.sin(0), rock.y+ROCK_DIAMETER*rock.rndList[i]*Math.cos(0));
  for (var i=0; i<6; i++) {
    c.lineTo(rock.x+ROCK_DIAMETER*rock.rndList[(i+1)%6]*Math.sin(((i+1)%6)/3*Math.PI), rock.y+ROCK_DIAMETER*rock.rndList[(i+1)%6]*Math.cos(((i+1)%6)/3*Math.PI));
  };

  c.closePath();
  c.fill();
  c.stroke();
}