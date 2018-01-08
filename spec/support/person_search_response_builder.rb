# frozen_string_literal: true

class PersonSearchResponseBuilder
  def self.build
    builder = new
    yield(builder)
    builder.search_response
  end

  def initialize
    @search_response = {
      hits: {
        total: 0,
        hits: []
      }
    }
  end

  def with_total(total)
    @search_response[:hits][:total] = total
  end

  def with_hits
    @search_response[:hits][:hits] = yield
  end

  attr_reader :search_response
end
