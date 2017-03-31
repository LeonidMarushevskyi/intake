# frozen_string_literal: true

module WebmockHelpers
  def remove_root_id(hash)
    hash.except('id')
  end

  def json_body(json, options = {})
    { body: json, headers: { 'Content-Type' => 'application/json' } }.merge(options)
  end

  def api_person_path(id)
    %r{.*/api/v1/people/#{id}}
  end

  def api_people_path
    %r{.*/api/v1/people}
  end

  def api_people_search_path(search_term:)
    %r{.*/api/v1/people_search\?search_term=#{search_term}$}
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

  def api_participant_path(id)
    %r{.*/api/v1/participants/#{id}}
  end
end

RSpec.configure do |config|
  config.include WebmockHelpers
end
