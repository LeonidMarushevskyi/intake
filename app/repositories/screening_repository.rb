# frozen_string_literal: true

# ScreeningRepository is a service class responsible for creation of a screening
# resource via the API
class ScreeningRepository
  SCREENINGS_PATH = '/api/v1/screenings'
  CONTENT_TYPE = 'application/json'

  def self.create(screening)
    response = make_api_call(SCREENINGS_PATH, :post, screening.as_json(except: :id))
    Screening.new(response.body)
  end

  def self.find(id)
    response = make_api_call("#{SCREENINGS_PATH}/#{id}", :get)
    Screening.new(response.body)
  end

  def self.update(screening)
    raise 'Error updating screening: id is required' unless screening.id
    response = make_api_call(
      "#{SCREENINGS_PATH}/#{screening.id}",
      :put,
      screening.as_json(except: :id)
    )
    Screening.new(response.body)
  end

  def self.search(search_terms)
    response = make_api_call("#{SCREENINGS_PATH}?#{search_terms.to_query}", :get)
    response.body.map do |result_attributes|
      Screening.new(result_attributes)
    end
  end

  def self.make_api_call(url, method, attributes = nil)
    ::API.connection.send(method) do |req|
      req.url url
      req.headers['Content-Type'] = CONTENT_TYPE unless method == :get
      req.body = attributes.to_json unless attributes.nil?
    end
  rescue Faraday::Error => e
    raise ApiError,
      message: e.message,
      sent_attributes: attributes.to_json,
      url: url, method: method
  end
  private_class_method :make_api_call
end
