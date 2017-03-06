# frozen_string_literal: true

# API module which will define abstracts the API connection
# The connection object will be used to talk to the API
module API
  def self.connection
    @connection ||= Faraday.new(url: ENV['API_URL']) do |connection|
      connection.response :json, content_type: /\bjson$/
      connection.adapter Faraday.default_adapter
      connection.use IntakeFaradayMiddleware::RaiseHttpException
    end
  end
end
