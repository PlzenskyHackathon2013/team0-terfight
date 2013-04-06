$(document).ready(function() {
	socket = io.connect(document.domain);
	socket.on("hello", function(data) {
	  	console.log(data);
	});
	socket.on("users", function(data) {
	    console.log(data);
	});

	var $canvas = $("#canv");
	var canvas = $canvas.get(0);
	
	canvasSizeUpdate = function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	};

	$(window).resize(canvasSizeUpdate);
	canvasSizeUpdate();

	window.canvas.startLoop($canvas);
});

my_direction = Math.PI;
already_pressed = [];
$(document).keydown(function(e) {
	if (already_pressed.indexOf(e.which) != -1) {
		return;
	};

	already_pressed.push(e.which);

	old_direction = my_direction;
    if ((already_pressed.indexOf(38) >= 0) && (already_pressed.indexOf(39) >= 0)){ 
    	my_direction = 3/4*Math.PI;  
    }
    if ((already_pressed.indexOf(38) >= 0) && (already_pressed.indexOf(37) >=0)) {
    	my_direction = 5/4*Math.Pi;
    }
    if ((already_pressed.indexOf(40) >= 0) && (already_pressed.indexOf(39) >= 0)){ 
    	my_direction = 1/4*Math.PI;  
    }
    if ((already_pressed.indexOf(40) >= 0) && (already_pressed.indexOf(37) >= 0)){ 
    	my_direction = 7/4*Math.PI;  
    }
    else if (already_pressed.indexOf(38) >= 0) {
		my_direction = Math.PI;
	}
	else if (e.which == 39) {
		my_direction = Math.PI / 2;
	}
	else if (e.which == 40) {
		my_direction = 0;
	}
	else if (e.which == 37) {
		my_direction = 3/2*Math.PI;
	};

	if (old_direction != my_direction) {
		socket.emit("move", { direction: my_direction });
		console.log("emit move, direction: " + my_direction);
	};
});
$(document).keyup(function(e) {
	for (var i=0; i<already_pressed.length; i++) {
		if (already_pressed[i] == e.which) {
			already_pressed.splice(i, 1);
			break;
		}
	};
});


window.main = {};

window.main.getAnts = function() {
  return [
    { x: 10, y: 20, dir: my_direction },
    { x: 50, y: 40, dir: Math.PI/2 },
    { x: 100, y: 100, dir: 0 }
  ];
}
