# frozen_string_literal: true

# ScreeningRepository is a service class responsible for creation of a screening
# resource via the API
class ScreeningRepository
  SCREENINGS_PATH = '/api/v1/screenings'

  def self.create(screening)
    response = API.make_api_call(SCREENINGS_PATH, :post, screening.as_json.except('id'))
    Screening.new(response.body)
  end

  def self.find(id)
    response = API.make_api_call("#{SCREENINGS_PATH}/#{id}", :get)
    Screening.new(response.body)
  end

  def self.update(screening)
    raise 'Error updating screening: id is required' unless screening.id
    response = API.make_api_call(
      "#{SCREENINGS_PATH}/#{screening.id}",
      :put,
      screening.as_json.except('id')
    )
    Screening.new(response.body)
  end

  def self.search(search_terms)
    response = API.make_api_call("#{SCREENINGS_PATH}?#{search_terms.to_query}", :get)
    response.body.map do |result_attributes|
      Screening.new(result_attributes)
    end
  end
end
