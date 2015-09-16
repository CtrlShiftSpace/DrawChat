module Mongoid
  module Document

    def self.included(base)
      base.class_eval do
        def self.primary_key
          'id'
        end
      end
    end

    #this method overrides the super as_json (Mongoid::Document which is mongoid module included in all models)
    #we make sure options whether passed or not include except: [:_id]
    #we manually make id equal to string interpretation of _id
    def as_json(options={})
      options[:except] = options[:except] || []
      options[:except] << :_id
      attrs = super(options)
      attrs["id"] = self["_id"].to_s
      attrs
    end

    #this is called for embedded objects whose parents were called with as_json
    def serializable_hash(options={})
      attrs = super(options)
      attrs[:id] = self.id.to_s
      attrs
    end

  end
end
