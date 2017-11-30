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

  def stub_person_search(search_term, person_response)
    stub_request(
      :post,
      dora_api_url(Rails.application.routes.url_helpers.dora_people_path)
    )
      .with('body' => {
              'query' => {
                'bool' => {
                  'must' => array_including(
                    'multi_match' => hash_including('query' => search_term.downcase)
                  )
                }
              },
              '_source' => anything,
              'highlight' => anything
            })
      .to_return(json_body(person_response.to_json, status: 200))
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

  def ferb_api_url(path)
    "#{Rails.application.config.intake[:ferb_api_url]}#{path}"
  end

  def dora_api_url(path)
    "#{Rails.application.config.intake[:dora_api_url]}#{path}"
  end
end

RSpec.configure do |config|
  config.include WebmockHelpers
end
