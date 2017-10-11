# frozen_string_literal: true

class JsonAPI # :nodoc:
  CONTENT_TYPE = 'application/json'

  def self.connection
    Faraday.new(url: api_url) do |connection|
      connection.response :json, content_type: /\bjson$/
      connection.adapter Faraday.default_adapter
      connection.use IntakeFaradayMiddleware::RaiseHttpException
      connection
    end
  end

  def self.make_api_call(security_token, url, method, payload = nil)
    connection.send(method) do |req|
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
