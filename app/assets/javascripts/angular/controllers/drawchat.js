(function() {
  var drawchatControllers = angular.module('drawchatControllers', ['ngRoute'])
  // angular.module("drawchatControllers", ['ngRoute'])

  //index controller, new controller
  drawchatControllers.controller("drawingsController", [ 'Drawing', function(Drawing) {
    this.drawings = Drawing.query();

    this.create = function(event) {
      event.preventDefault();
      Drawing.save(this.drawing, function(drawing) {
        $location.path("/drawings/" + drawing.id);
      });
    }
  }]);

  //show controller
  drawchatControllers.controller("drawingController", [ '$routeParams', 'Drawing', function($routeParams, Drawing){
    var self = this;
    $("#colorPicker").tinycolorpicker();
    this.drawing = Drawing.get({id: $routeParams.id}, function(drawing) {
      self.drawChart();
    });


    this.BrushModes = {
      paint: 1,
      line: 2,
      rectangle: 3,
      circle: 4
    };
//  { name: "Test Test Test" , moves: [ { brush: 2, thickness: 2, color: 'rgb(255, 255, 0)', origin: { x: 100, y: 3 }, coordinates: [ { x: 60, y: 75 }, { x: 140, y: 75 } ] }, { brush: 3, thickness: 3, color: 'rgb(0, 255, 0)', origin: { x: 100, y: 50 }, coordinates: [ {r: 40} ] } ] }

    this.brush = this.BrushModes.paint;
    this.thickness = $('#myRange').val();

    this.drawChart = function() {
      var self = this;

      var canvas = document.getElementById("myCanvas");
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      $.each(this.drawing.moves, function(index, move) {
        if (move.coordinates !== undefined && move.coordinates.length > 0) {
          ctx.lineWidth = move.thickness;
          ctx.strokeStyle = move.color;
          ctx.fillStyle = move.color;
          ctx.beginPath();
          if (move.brush == self.BrushModes.circle) {
            ctx.arc(move.origin.x, move.origin.y, move.coordinates[0].r, 0, Math.PI*2, false);
          } else {
            ctx.moveTo(move.origin.x, move.origin.y);
              $.each(move.coordinates, function(index, line) {
                ctx.lineTo(line.x, line.y);
              })
              if (move.brush == self.BrushModes.rectangle || move.brush == self.BrushModes.line) {
                ctx.closePath();
              }
          }

          ctx.stroke();
          ctx.save();
        }
      })
    }

    this.startPath = function(e) {
      var coords = this.translateCoords(e)

      var myNewLine = {thickness: this.thickness, brush: this.brush, color: $('.colorInput').val(), origin: {x: coords.x, y: coords.y}, coordinates: []};
      this.drawing.moves = this.drawing.moves || [];
      this.drawing.moves.push(myNewLine);
      this.isPenDown = true;
    }

    this.drawPath = function(e) {

      if(this.isPenDown) {
        var coords = this.translateCoords(e);
        var lastMove = this.drawing.moves[this.drawing.moves.length-1];
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
      move.coordinates.push({x: coords.x, y: coords.y});
    }

    this.drawWithLine = function (move, coords) {
      move.coordinates = [{x: coords.x, y: coords.y}];
    }
    this.drawWithRectangle = function(move, coords) {
      move.coordinates = [{x: move.origin.x, y: coords.y},
                    {x: coords.x, y: coords.y},
                    {x: coords.x, y: move.origin.y}]
    }

    this.drawWithCircle = function(move, coords) {
      move.origin.x = move.origin.x
      move.origin.y = move.origin.y
      var radius = Math.sqrt( Math.pow( (coords.x - move.origin.x), 2) + Math.pow( coords.y - move.origin.y, 2) )
      move.coordinates = [{r: radius}]
    }

    this.endPath = function(e) {
      var coords = this.translateCoords(e);
      this.isPenDown = false;
      this.drawChart();
      this.drawing.$update({id: this.drawing.id})
    }

    this.translateCoords = function(e) {
      var $body = $('body');
      var $canvas = $('#myCanvas');
      var canvasOffset = $canvas.offset();

      return { x: e.clientX - canvasOffset.left + $body.scrollLeft(), y: e.clientY - canvasOffset.top + $body.scrollTop() }
    }

    this.clearCanvas = function() {
      var canvas = document.getElementById("myCanvas");
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }]);


})();
