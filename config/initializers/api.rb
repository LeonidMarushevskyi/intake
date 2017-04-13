# frozen_string_literal: true

# API module which will define abstracts the API connection
# The connection object will be used to talk to the API
module API
  CONTENT_TYPE = 'application/json'

  def self.connection_settings(connection)
    connection.response :json, content_type: /\bjson$/
    connection.adapter Faraday.default_adapter
    connection.use IntakeFaradayMiddleware::RaiseHttpException
    connection
  end

  def self.tpt_api_connection
    @tpt_connection ||= Faraday.new(url: ENV.fetch('TPT_API_URL')) do |connection|
      ::API.connection_settings connection
    end
  end

  def self.intake_api_connection
    @connection ||= Faraday.new(url: ENV.fetch('API_URL')) do |connection|
      ::API.connection_settings connection
    end
  end

  def self.fetch_api_connection(url)
    api_connection = ::API.intake_api_connection

    if ENV.fetch('TPT_API_URL', false) && (url.match %r{/api/v1/people_search})
      api_connection = ::API.tpt_api_connection
    end

    api_connection
  end

  def self.make_api_call(security_token, url, method, payload = nil)
    fetch_api_connection(url).send(method) do |req|
      req.url url
      req.headers['Content-Type'] = CONTENT_TYPE unless method == :get
      req.headers['Authorization'] = security_token
      req.body = payload.to_json unless payload.nil?
    end
  rescue Faraday::Error => e
    raise ApiError,
      message: e.message, sent_attributes: payload.to_json,
      url: url, method: method
  end
end
