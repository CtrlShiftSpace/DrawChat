# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
Drawing.collection.drop

drawing = Drawing.new( { name: "Triangle over Circle" , moves: [ { brush: 2, thickness: 2, color: 'rgb(255, 255, 0)', origin: { x: 100, y: 3 }, coordinates: [ { x: 60, y: 75 }, { x: 140, y: 75 } ] },
                                                                 { brush: 4, thickness: 3, color: 'rgb(0, 255, 0)', origin: { x: 100, y: 50 }, coordinates: [ {r: 40} ] }
                                                               ] } );

drawing.save
