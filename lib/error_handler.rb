# frozen_string_literal: true

# ErrorHandler catches all API errors and re format them as JSON
module ErrorHandler
  def self.included(base)
    base.class_eval do
      rescue_from StandardError, with: :handle_exception
    end
  end

  def handle_exception(exception)
    case exception
    when ApiError
      log_error(exception, 'API_ERROR')
      render json: generate_api_error(exception), status: exception.api_error[:http_code]
    when StandardError
      log_error(exception, 'STANDARD_ERROR')
      render json: generate_standard_error(exception), status: 500
    end
  end

  def generate_api_error(exception)
    {
      error: :api_error,
      status: exception.api_error[:http_code],
      message: exception.message,
      api_response_body: api_response_body(exception.api_error[:response_body]),
      url: exception.api_error[:url],
      method: exception.api_error[:method],
      sent_attributes: exception.api_error[:sent_attributes]
    }.as_json
  end

  def generate_standard_error(exception)
    {
      error: :standard_error,
      status: 500,
      message: exception.to_s
    }.as_json
  end

  def log_error(exception, type)
    if type == 'API_ERROR'
      Rails.logger.error "[#{type}] found processing an api call:
      - message: #{exception.message}
      - URL    : #{exception.api_error[:url]}
      - status : #{exception.api_error[:http_code]}
      - method : #{exception.api_error[:method]}"
    else
      Rails.logger.error " [#{type}] found processing an api call:
      - message: #{exception.message}\n      - backtrace: #{exception.backtrace}"
    end
  end

  private

  def api_response_body(response_body)
    JSON.parse(response_body)
  rescue
    response_body
  end
end
