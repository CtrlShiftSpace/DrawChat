class Api::MovesController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def create
    @drawing = Drawing.find(params[:drawing_id])
    move = @drawing.moves.build(move_params)

    if @drawing.save
      # Pusher.trigger("drawing#{@drawing.id}", 'move created', {
      #   move: move.as_json
      # })
      render json: move.as_json, status: :ok
    else
      render json: move.errors, status: :unprocessable_entity
    end
  end

  private
    def move_params
      params.permit( :brush, :thickness, :color, origin: [:x, :y], coordinates: [ :x, :y, :r ])
    end

end
