class Drawing
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String, default: 'Untitled Work'

  embeds_many :moves, cascade_callbacks: true

end
