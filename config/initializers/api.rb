# frozen_string_literal: true

# API module which will define abstracts the API connection
# The connection object will be used to talk to the API
module API
  CONTENT_TYPE = 'application/json'

  def self.tpt_connection
    @tpt_connection ||= Faraday.new(url: ENV.fetch('TPT_API_URL')) do |connection|
      connection.response :json, content_type: /\bjson$/
      connection.adapter Faraday.default_adapter
      connection.use IntakeFaradayMiddleware::RaiseHttpException
    end
  end

  def self.connection
    @connection ||= Faraday.new(url: ENV.fetch('API_URL')) do |connection|
      connection.response :json, content_type: /\bjson$/
      connection.adapter Faraday.default_adapter
      connection.use IntakeFaradayMiddleware::RaiseHttpException
    end
  end

  def self.make_api_call(url, method, attributes = nil)
    if ENV.fetch("TPT_API_URL", false) and url.match %r{/api/v1/people_search}
      ::API.tpt_connection.send(method) do |req|
        req.url url
        req.headers['Content-Type'] = CONTENT_TYPE unless method == :get
        req.body = attributes.to_json unless attributes.nil?
      end
    else
      ::API.connection.send(method) do |req|
        req.url url
        req.headers['Content-Type'] = CONTENT_TYPE unless method == :get
        req.body = attributes.to_json unless attributes.nil?
      end
    end
  rescue Faraday::Error => e
    raise ApiError,
      message: e.message,
      sent_attributes: attributes.to_json,
      url: url, method: method
  end
end
