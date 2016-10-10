# frozen_string_literal: true

# ScreeningsRepo is the Repository object for accessing Screenings ES index
class ScreeningsRepo
  include Elasticsearch::Persistence::Repository

  def initialize(options = {})
    index options[:index] || 'screenings'
    es_host = ENV['ELASTICSEARCH_URL']
    client Elasticsearch::Client.new(host: es_host)
  end

  klass Screening

  def serialize(document)
    document.attributes
  end
end
