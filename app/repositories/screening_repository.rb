# frozen_string_literal: true

# ScreeningRepository is a service class responsible for creation of a screening
# resource via the API
class ScreeningRepository
  def self.create(security_token, screening)
    response = IntakeAPI.make_api_call(
      security_token,
      ExternalRoutes.intake_api_screenings_path,
      :post,
      screening.as_json.except('id')
    )
    Screening.new(response.body)
  end

  def self.find(security_token, id)
    response = IntakeAPI.make_api_call(
      security_token,
      ExternalRoutes.intake_api_screening_path(id),
      :get
    )
    Screening.new(response.body)
  end

  def self.update(security_token, screening)
    raise 'Error updating screening: id is required' unless screening.id
    response = IntakeAPI.make_api_call(
      security_token,
      ExternalRoutes.intake_api_screening_path(screening.id),
      :put,
      screening.as_json.except('id')
    )
    Screening.new(response.body)
  end

  def self.search(security_token, search_terms)
    response = IntakeAPI.make_api_call(
      security_token,
      ExternalRoutes.intake_api_screenings_path(search_terms),
      :get
    )
    response.body.map do |result_attributes|
      ScreeningSearch.new(result_attributes)
    end
  end

  def self.history_of_involvements(security_token, id)
    response = IntakeAPI.make_api_call(
      security_token,
      ExternalRoutes.intake_api_history_of_involvements_path(id),
      :get
    )
    response.body
  end

  def self.submit(security_token, id)
    response = IntakeAPI.make_api_call(
      security_token,
      ExternalRoutes.intake_api_screening_submit_path(id),
      :post
    )
    Screening.new(response.body)
  end
end
