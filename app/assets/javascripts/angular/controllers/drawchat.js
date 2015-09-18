(function() {
  var drawchatControllers = angular.module('drawchatControllers', ['ngRoute'])

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
  //Pusher injected as a dependency
  drawchatControllers.controller("drawingController", [ '$routeParams', '$location', 'Drawing', 'Move', function($routeParams, $location, Drawing, Move){
    var self = this;

    this.drawing = Drawing.get({id: $routeParams.id}, function(drawing) {
      self.drawChart();
      // Pusher.subscribe('drawing' + this.drawing.id, 'move created', function (item) {
      //   // an item was updated. find it in our list and update it.
      //   alert("hola");
      // });
    });

    // library
    $("#colorPicker").tinycolorpicker();
    this.BrushModes = {
      paint: 1,
      line: 2,
      rectangle: 3,
      circle: 4
    };
//  { name: "Test Test Test" , moves: [ { brush: 2, thickness: 2, color: 'rgb(255, 255, 0)', origin: { x: 100, y: 3 }, coordinates: [ { x: 60, y: 75 }, { x: 140, y: 75 } ] }, { brush: 3, thickness: 3, color: 'rgb(0, 255, 0)', origin: { x: 100, y: 50 }, coordinates: [ {r: 40} ] } ] }

  // setting default values
    this.brush = this.BrushModes.paint;
    this.thickness = $('#myRange').val();
    this.color = $("#colorPicker").data("plugin_tinycolorpicker").setColor('rgb(254,39,18)');
    this.canvasIsVisible = true;

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

    // drawing
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

    // brush modes
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
      this.drawing.$update({id: this.drawing.id});
      var lastMove = this.drawing.moves[this.drawing.moves.length-1];
      Move.save({ drawing_id: this.drawing.id }, lastMove);
    }

    this.translateCoords = function(e) {
      var $body = $('body');
      var $canvas = $('#myCanvas');
      var canvasOffset = $canvas.offset();

      return { x: e.clientX - canvasOffset.left + $body.scrollLeft(), y: e.clientY - canvasOffset.top + $body.scrollTop() }
    }

    // actions
    this.clearCanvas = function(id) {
      var canvas = document.getElementById("myCanvas");
      var ctx = canvas.getContext("2d");

      this.drawing.moves = [];

      this.drawing.$update({id: this.drawing.id, moves: []}, function(drawing) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } );
    }

    this.undoMove = function() {
      var self = this;
      var last = this.drawing.moves.length - 1;

      this.undoedMoves.push(this.drawing.moves[last]);
      this.drawing.moves.splice(last, 1);
      this.drawing.$update({id: this.drawing.id, moves: []}, function(drawing) {
        self.drawChart();
      } );
    }

    this.undoedMoves = [];

    this.redoMove = function() {
      var self = this;
      var first = this.undoedMoves.length - 1;

      this.drawing.moves.push(this.undoedMoves[first]);
      this.undoedMoves.splice(first, 1);
      this.drawing.$update({id: this.drawing.id, moves: []}, function(drawing) {
        self.drawChart();
      } );
    }

    this.saveAsImg = function() {
      var canvas = document.getElementById("myCanvas");
      var dataURL = canvas.toDataURL();
      canvas.style.display = "none";

      var image = document.getElementById('canvasImg')
      image.src = dataURL;
      image.style.display = "visible"
      this.canvasIsVisible = false;
    }

    this.showCanvas = function() {
      console.log('showCanvas')
      this.canvasIsVisible = true;
      document.getElementById('myCanvas').style.display = 'block';
      // this.drawChart();
    }

    this.deleteDrawing = function(id) {
      Drawing.delete({id: id}, function() {
        $location.path("/drawings")
      });
    }

  }]);


})();
