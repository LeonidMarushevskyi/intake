# frozen_string_literal: true

module WebmockHelpers
  def as_json_without_root_id(model)
    model.as_json.except('id')
  end

  def json_body(json, options = {})
    { body: json, headers: { 'Content-Type' => 'application/json' } }.merge(options)
  end

  def host_url(path)
    "#{Rails.application.config.intake[:api_url]}#{path}"
  end
end

RSpec.configure do |config|
  config.include WebmockHelpers
end
