(function() {
  angular.module("drawchatControllers", [])
  .controller("drawchatController", function(){
    this.BrushModes = {
      paint: 1,
      line: 2,
      rectangle: 3,
      circle: 4
    };

    this.moves = [{brush: 'rectangle', thickness: 20, color: 'rgb(255, 0, 0)', originX: 50, originY: 50, coords: [{x: 50, y: 250}, {x: 250, y: 250}, {x: 250, y: 50}] },
                  {brush: 'line', thickness: 10, color: 'rgb(0, 255, 0)', originX: 100, originY: 60, coords: [{x: 100, y: 250}, {x: 250, y: 250}] },
                  {brush: 'circle', thickness: 2, color: 'rgb(0, 0, 255)', originX: 150, originY: 150, coords: [{r: 50}] } ];

    this.brush = this.BrushModes.paint;
    this.currentColor = $('#color').val();

    this.drawChart = function() {
      var canvas = document.getElementById("myCanvas");
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      $.each(this.moves, function(index, move) {
        ctx.lineWidth = move.thickness;
        ctx.strokeStyle = move.color;
        ctx.fillStyle = move.color;
        ctx.beginPath();
        if (move.brush == 'circle') {
          ctx.arc(move.originX, move.originY, move.coords[0].r, 0, Math.PI*2, false);
        } else {
          ctx.moveTo(move.originX, move.originY);
            $.each(move.coords, function(index, line) {
              ctx.lineTo(line.x, line.y);
            })
            if (move.brush == 'rectangle' || move.brush == 'line') {
              ctx.closePath();
            }
        }

        ctx.stroke();
        ctx.save();
      })
    }

    this.startPath = function(e) {
      var coords = this.translateCoords(e)

      var myNewLine = {thickness: 5, color: this.currentColor, originX: coords.x, originY: coords.y, coords: []};
      this.moves.push(myNewLine);
      this.isPenDown = true;
    }

    this.drawPath = function(e) {

      if(this.isPenDown) {
        var coords = this.translateCoords(e);
        var lastMove = this.moves[this.moves.length-1];
        switch (parseInt(this.brush)) {
          case this.BrushModes.paint:
            this.drawWithBrush(lastMove, coords);
            break;
          case this.BrushModes.line:
            this.drawWithLine(lastMove, coords);
            break;
          case this.BrushModes.rectangle:
            this.drawWithRectangle(lastMove, coords);
            break;
          case this.BrushModes.circle:
            this.drawWithCircle(lastMove, coords);
            break;
        }
        this.drawChart();
      }
    }

    this.drawWithBrush = function (move, coords) {
      move.coords.push({x: coords.x, y: coords.y});
    }

    this.drawWithLine = function (move, coords) {
      move.coords = [{x: coords.x, y: coords.y}];
    }
    this.drawWithRectangle = function(move, coords) {
      move.brush = 'rectangle'
      move.coords = [{x: move.originX, y: coords.y},
                    {x: coords.x, y: coords.y},
                    {x: coords.x, y: move.originY}]
    }

    this.drawWithCircle = function(move, coords) {
      move.brush = 'circle'
      move.originX = move.originX
      move.originY = move.originY
      var radius = Math.sqrt( Math.pow( (coords.x - move.originX), 2) + Math.pow( coords.y - move.originY, 2) )
      move.coords = [{r: radius}]
    }

    this.endPath = function(e) {
      var coords = this.translateCoords(e);
      this.isPenDown = false;
      this.drawChart();
    }

    this.translateCoords = function(e) {
      var $canvas = $('#myCanvas');
      var canvasOffset = $canvas.offset();

      return {x: e.clientX - canvasOffset.left, y: e.clientY - canvasOffset.top}
    }
  })

})();
