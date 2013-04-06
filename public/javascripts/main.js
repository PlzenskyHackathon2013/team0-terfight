$(document).ready(function() {
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

    if ((already_pressed.indexOf(38) >= 0) && (already_pressed.indexOf(39) >= 0)){ 
    	my_direction = 3/4*Math.PI;  
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