class Move
  include Mongoid::Document
  include Mongoid::Timestamps

  field :brush, type: Integer
  field :thickness, type: Integer
  field :color, type: String
  # field :originX, type: Integer
  # field :originY, type: Integer

  embeds_one :origin, class_name: 'Coordinate', cascade_callbacks: true

  embedded_in :drawing
  embeds_many :coordinates, cascade_callbacks: true

end
