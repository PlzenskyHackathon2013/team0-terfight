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

ARROW_LENGTH = 10;
window.canvas.drawAnt = function (c, x, y, dir) {
  c.strokeStyle = "#000";
  c.lineWidth = 2;
  
  c.beginPath();
  
  c.moveTo(x, y);
  c.lineTo(x+ARROW_LENGTH*Math.sin(dir), y+ARROW_LENGTH*Math.cos(dir));
  
  c.stroke();
  c.closePath();
}

ROCK_DIAMETER = 20;
window.canvas.drawRock = function (c, rock) {
  c.fillStyle = "#aaa";

  c.beginPath();

  if (!rock.rndList) {
    rock.rndList = {};
    for (var i=0; i<6; i++) {
      rock.rndList[i] = 0.2+Math.random()*0.8;
    };
  }

  for (var i=0; i<6; i++) {
    c.moveTo(rock.x+ROCK_DIAMETER*rock.rndList[i]*Math.sin(i/3*Math.PI), rock.y+ROCK_DIAMETER*rock.rndList[i]*Math.cos(i/3*Math.PI));
    c.lineTo(rock.x+ROCK_DIAMETER*rock.rndList[(i+1)%6]*Math.sin(((i+1)%6)/3*Math.PI), rock.y+ROCK_DIAMETER*rock.rndList[(i+1)%6]*Math.cos(((i+1)%6)/3*Math.PI));
  };

  c.stroke();
  c.fill();
  c.closePath();
}