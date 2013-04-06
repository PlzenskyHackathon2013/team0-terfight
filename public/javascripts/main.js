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

window.main = {};

window.main.getAnts = function() {
  return [
    { x: 10, y: 20, dir: 2 },
    { x: 50, y: 40, dir: 1 },
    { x: 100, y: 100, dir: 0 }
  ];
}