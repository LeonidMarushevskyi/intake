# frozen_string_literal: true

# SecurityRepository is responsible for managing calls
# to the security API
class SecurityRepository
  class << self
    def retrieve_security_token(access_code: nil, token: nil)
      if Feature.active?(:perry_version_two)
        return unless access_code.present?
        call_api_to_map_token(access_code)
      else
        token
      end
    end

    def auth_artifact_for_token(token)
      return unless token.present?
      auth_artifact = Faraday.get(token_validation_url(token))
      auth_artifact.body if auth_artifact.status == 200
    end

    def login_url(callback)
      "#{Rails.configuration.intake[:authentication_login_url]}#{callback}"
    end

    def logout_url
      Rails.configuration.intake[:authentication_logout_url]
    end

    def access_code_mapping_url(access_code)
      authentication_base_url = Rails.configuration.intake[:authentication_base_url]
      "#{authentication_base_url}/authn/token?accessCode=#{access_code}"
    end

    def token_validation_url(token)
      "#{Rails.configuration.intake[:authentication_base_url]}/authn/validate?token=#{token}"
    end

    private

    def call_api_to_map_token(access_code)
      response = Faraday.get(access_code_mapping_url(access_code))
      response.body if response.status == 200
    end
  end
end
