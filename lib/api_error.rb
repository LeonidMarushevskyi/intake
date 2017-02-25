# frozen_string_literal: true
#
# ApiError is an API error wrapper that produces more information about the exception.
class ApiError < StandardError
  attr_reader :api_error

  def initialize(exception_info)
    @api_error = generate_base_message(exception_info)

    unless exception_info[:response].nil?
      api_response = exception_info[:response]
      @api_error[:response_body] = api_response.body if api_response.body.present?
      @api_error[:http_code] = api_response.status if api_response.status.present?
    end

    super(exception_info[:message])
  end

  def generate_base_message(exception_info)
    {
      response_body: 'N/A',
      url: exception_info[:api_url],
      method: exception_info[:method],
      sent_attributes: exception_info[:sent_attributes],
      http_code: 'N/A'
    }
  end
end
