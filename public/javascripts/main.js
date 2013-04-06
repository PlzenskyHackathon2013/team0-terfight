$(document).ready(function() {
	window.canvas.startLoop(document.getElementById("canv"));
});

window.main = {};

window.main.getAnts = function() {
  return [
    { x: 10, y: 20, dir: 2 },
    { x: 50, y: 40, dir: 1 },
    { x: 100, y: 100, dir: 0 }
  ];
}