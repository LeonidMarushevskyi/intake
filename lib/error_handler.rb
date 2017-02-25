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
      render json: generate_api_error(exception)
    when StandardError
      render json: generate_standard_error(exception)
    end
  end

  def generate_api_error(exception)
    {
      error: :api_error,
      status: exception.api_error[:http_code],
      message: exception.message,
      api_response_body: exception.api_error[:response_body],
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
end
