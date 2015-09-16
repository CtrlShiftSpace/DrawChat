class Coordinate
  include Mongoid::Document
  include Mongoid::Timestamps

  field :x, type: Integer
  field :y, type: Integer
  field :r, type: Integer

end
