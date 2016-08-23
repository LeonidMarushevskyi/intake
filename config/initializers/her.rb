# frozen_string_literal: true

API_URL = ENV['API_URL'] || 'http://localhost:3001'

API_V1 = Her::API.new
API_V1.setup url: "#{API_URL}/api/v1" do |c|
  # Request
  c.use Faraday::Request::UrlEncoded

  # Response
  c.use Her::Middleware::DefaultParseJSON

  # Adapter
  c.use Faraday::Adapter::NetHttp
end
