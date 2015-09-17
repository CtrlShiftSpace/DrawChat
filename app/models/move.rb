class Move
  include Mongoid::Document
  include Mongoid::Timestamps

  field :brush, type: Integer, default: 1
  field :thickness, type: Integer, default: 10
  field :color, type: String, default: 'rgb(254,39,18)'

  embeds_one :origin, class_name: 'Coordinate', cascade_callbacks: true

  embedded_in :drawing
  embeds_many :coordinates, cascade_callbacks: true

end
