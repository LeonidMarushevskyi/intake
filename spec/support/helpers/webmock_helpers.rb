# frozen_string_literal: true

module WebmockHelpers
  def stub_screening_put_request_with_anything_and_return(
    screening,
    with_updated_attributes: {}
  )
    screening.assign_attributes(with_updated_attributes)
    stub_request(:put, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json))
  end

  def as_json_without_root_id(model)
    model.as_json.except('id')
  end

  def json_body(json, options = {})
    { body: json, headers: { 'Content-Type' => 'application/json' } }.merge(options)
  end

  def intake_api_url(path)
    base_path = Rails.application.config.intake[:api_url].sub(%r{/$}, '')
    specific_path = path.sub(%r{^/}, '')
    "#{base_path}/#{specific_path}"
  end
end

RSpec.configure do |config|
  config.include WebmockHelpers
end
