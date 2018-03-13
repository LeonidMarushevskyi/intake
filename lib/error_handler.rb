# frozen_string_literal: true

# rubocop:disable Lint/RescueWithoutErrorClass

# ErrorHandler catches all API errors and re format them as JSON
module ErrorHandler
  def self.included(base)
    base.class_eval do
      if Rails.env.test?
        rescue_from(WebMock::NetConnectNotAllowedError) do |exception|
          incident_id = SecureRandom.uuid
          log_standard_error(exception, incident_id)
          raise StandardError, exception.message
        end
      end
      rescue_from StandardError, with: :handle_exception
    end
  end

  def handle_exception(exception)
    case exception
    when ApiError
      exception = add_issue_details(exception)
      log_api_error(exception)
      render json: generate_api_error(exception), status: exception.api_error[:http_code]
    when StandardError
      incident_id = SecureRandom.uuid
      log_standard_error(exception, incident_id)
      render json: generate_standard_error(exception, incident_id), status: 500
    end
  end

  def add_issue_details(exception)
    if exception.respond_to?(:api_error) && parse_issue_details(exception).empty?
      exception.api_error[:response_body] = generate_isssue_details(exception)
    end
    exception
  end

  def generate_isssue_details(exception)
    {
      issue_details: [{
        incident_id: SecureRandom.uuid,
        status: exception.api_error[:http_code],
        type: exception.class.name.underscore,
        response_body: exception.api_error[:response_body]
      }]
    }
  end

  def parse_issue_details(exception)
    issue_details = api_response_body(exception.api_error[:response_body])
                    .with_indifferent_access[:issue_details]
    issue_details.is_a?(Array) ? issue_details : throw
  rescue
    []
  end

  def stringify_incident_ids(exception)
    parse_issue_details(exception).collect do |issue_detail|
      issue_detail.with_indifferent_access[:incident_id]
    end.join(', ')
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

  # rubocop:disable MethodLength
  def generate_standard_error(exception, incident_id)
    {
      error: :standard_error,
      status: 500,
      message: exception.to_s,
      api_response_body: {
        issue_details: [{
          incident_id: incident_id,
          status: 500,
          type: :standard_error,
          response_body: exception.to_s
        }]
      }
    }
  end

  def log_api_error(exception)
    Rails.logger.error "[API ERROR] found processing an api call:
    - incident_ids: #{stringify_incident_ids(exception)}
    - message: #{exception.message}
    - URL    : #{exception.api_error[:url]}
    - status : #{exception.api_error[:http_code]}
    - method : #{exception.api_error[:method]}"
  end

  def log_standard_error(exception, incident_id)
    Rails.logger.error "[STANDARD ERROR] found processing an api call:
    - incident_ids: #{incident_id}
    - message: #{exception.message}
    - backtrace: #{exception.backtrace}"
  end

  private

  def api_response_body(response_body)
    JSON.parse(response_body)
  rescue
    response_body
  end
end
