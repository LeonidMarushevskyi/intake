# frozen_string_literal: true

module WebmockHelpers
  def as_json_without_root_id(model)
    model.as_json.except('id')
  end

  def json_body(json, options = {})
    { body: json, headers: { 'Content-Type' => 'application/json' } }.merge(options)
  end

  def api_person_path(id)
    intake_api_person_url(id)
  end

  def api_people_path
    intake_api_people_url
  end

  def api_people_search_path(search_term:)
    intake_api_people_search_url(search_term: search_term)
  end

  def api_screenings_path
    intake_api_screenings_url
  end

  def api_screening_path(id)
    intake_api_screening_url(id)
  end

  def api_participants_path
    intake_api_participants_url
  end

  def api_participant_path(id)
    intake_api_participant_url(id)
  end
end

RSpec.configure do |config|
  config.include WebmockHelpers
end
