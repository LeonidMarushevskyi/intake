# frozen_string_literal: true

class JsonAPI # :nodoc:
  CONTENT_TYPE = 'application/json'
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
