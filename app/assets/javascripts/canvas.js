$(document).ready(function() {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");


  ctx.beginPath();        //starts a new path.
  ctx.moveTo(50, 50);     //moves the point that the path is drawn from.
  ctx.lineTo(50, 250);    //draws a straight path to this point from the point defined in moveTo, or the point from the last call to lineTo.
  ctx.lineTo(250, 250);
  ctx.closePath();        //closes the path by connecting the last point to the starting point.
  // ctx.fill();          //fills the path with a colour.
  ctx.stroke();           //outlines the path.

});  
