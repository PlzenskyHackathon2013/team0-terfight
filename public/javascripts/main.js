$(document).ready(function() {
	socket = io.connect(document.domain);
	socket.on("hello", function(data) {
		helloData = data;
	  	console.log(data);
	});
	socket.on("users", function(data) {
	    usersData = data;
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

var my_direction = Math.PI;
var already_pressed = [];

dir_change = function(e) {
	something_happened = true;
    if ((already_pressed.indexOf(38) >= 0) && (already_pressed.indexOf(39) >= 0)){ 
    	my_direction = 3/4*Math.PI;
    }
    else if ((already_pressed.indexOf(38) >= 0) && (already_pressed.indexOf(37) >=0)) {
    	my_direction = 5/4*Math.PI;
    }
    else if ((already_pressed.indexOf(40) >= 0) && (already_pressed.indexOf(39) >= 0)){ 
    	my_direction = 1/4*Math.PI;  
    }
    else if ((already_pressed.indexOf(40) >= 0) && (already_pressed.indexOf(37) >= 0)){ 
    	my_direction = 7/4*Math.PI;  
    }
    else if (already_pressed.indexOf(38) >= 0) {
		my_direction = Math.PI;
	}
	else if (already_pressed.indexOf(39) >= 0) {
		my_direction = Math.PI / 2;
	}
	else if (already_pressed.indexOf(40) >= 0) {
		my_direction = 0;
	}
	else if (already_pressed.indexOf(37) >= 0) {
		my_direction = 3/2*Math.PI;
	}
	else
	{
		something_happened = false;
	};

	if (something_happened) {
		socket.emit("move", { direction: my_direction });
		console.log("emit move, direction: " + my_direction);
	}

	if (already_pressed.indexOf(32) >= 0) {
		socket.emit("fire", {});
		console.log("fire");
	}
};

$(document).keydown(function(e) {
	if (already_pressed.indexOf(e.which) != -1) {
		return;
	};

	already_pressed.push(e.which);

	dir_change(e);
});
$(document).keyup(function(e) {
	for (var i=0; i<already_pressed.length; i++) {
		if (already_pressed[i] == e.which) {
			already_pressed.splice(i, 1);
			break;
		}
	};

	dir_change(e);
});


window.main = {};

window.main.getAnts = function() {
  return [
    { x: 10, y: 20, dir: my_direction },
    { x: 50, y: 40, dir: Math.PI/2 },
    { x: 100, y: 100, dir: 0 }
  ];
}
