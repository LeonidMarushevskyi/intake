# frozen_string_literal: true

# ReferralsRepo is the Repository object for accessing Referrals ES index
class ReferralsRepo
  include Elasticsearch::Persistence::Repository

  def initialize(options = {})
    index options[:index] || 'referrals'
    es_host = ENV['ELASTICSEARCH_URL']
    client Elasticsearch::Client.new(host: es_host)
  end

  klass Referral

  def serialize(document)
    document.attributes
  end
end
