# frozen_string_literal: true

IntakeAPI.connection = Faraday.new(url: Rails.application.config.intake[:api_url]) do |connection|
  connection.response :json, content_type: /\bjson$/
  connection.adapter Faraday.default_adapter
  connection.use IntakeFaradayMiddleware::RaiseHttpException
  connection
end

ferb_api_url = Rails.application.config.intake[:ferb_api_url]
FerbAPI.connection = Faraday.new(url: ferb_api_url) do |connection|
  connection.response :json, content_type: /\bjson$/
  connection.adapter Faraday.default_adapter
  connection.use IntakeFaradayMiddleware::RaiseHttpException
  connection
end
