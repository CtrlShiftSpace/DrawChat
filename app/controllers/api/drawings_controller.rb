class Api::DrawingsController < ApplicationController
  protect_from_forgery
  skip_before_filter :verify_authenticity_token

  def index
    @drawings = Drawing.all

    render json: @drawings.as_json(only: [:id, :name]), status: :ok
  end

  def show
    @drawing = Drawing.find(params[:id])
    render json: @drawing.as_json, status: :ok
  end

  def create
    @drawing = Drawing.new(drawing_params)

    if @drawing.save
      render json: @drawing.as_json, status: :created
    else
      render json: @drawing.errors, status: :unprocessable_entity
    end
  end

  def update
    @drawing = Drawing.find(params[:id])
    move_param_ids = drawing_params[:moves] ? drawing_params[:moves].map { |move| move[:id] } : []
    deleted_moves = @drawing.moves.not_in(id: move_param_ids)
    deleted_moves.each do |deleted_move|
      deleted_move.delete
    end

    if @drawing.update(drawing_params)
      render json: @drawing.as_json, status: :ok
    else
      render json: @drawing.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @drawing = Drawing.find(params[:id])
    @drawing.destroy
    render json: {message: "success"}, status: :ok
  end

  private
    # Never trust parameters from the scary internet, only allow the white list through.
    def drawing_params
#{ name: "Test Test Test" , moves: [ { brush: 2, thickness: 2, color: 'rgb(255, 255, 0)', origin: { x: 100, y: 3 }, coordinates: [ { x: 60, y: 75 }, { x: 140, y: 75 } ] }, { brush: 3, thickness: 3, color: 'rgb(0, 255, 0)', origin: { x: 100, y: 50 }, coordinates: [ {r: 40} ] } ] }
            #.permit(:name, {:emails => []}, :friends => [ :name, { :family => [ :name ], :hobbies => [] }])
      params.permit( :name, :moves => [ :brush, :thickness, :color, origin: [:x, :y], coordinates: [ :x, :y, :r ] ] )
    end


end
