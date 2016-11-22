# frozen_string_literal: true

module WebmockHelpers
  def json_body(json)
    { body: json, headers: { 'Content-Type' => 'application/json' } }
  end

  def api_person_path(id)
    %r{.*/api/v1/people/#{id}}
  end

  def api_people_path
    %r{.*/api/v1/people}
  end

  def api_screenings_path
    %r{.*/api/v1/screenings}
  end

  def api_screening_path(id)
    %r{.*/api/v1/screenings/#{id}}
  end

  def api_participants_path
    %r{.*/api/v1/participants}
  end
end

RSpec.configure do |config|
  config.include WebmockHelpers, type: :feature
end
