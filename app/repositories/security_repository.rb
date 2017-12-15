# frozen_string_literal: true

# SecurityRepository is responsible for managing calls
# to the security API
class SecurityRepository
  class << self

    def auth_artifact_for_token(token)
      return unless token.present?
      auth_artifact = Faraday.get(token_validation_url(token))
      auth_artifact.body if auth_artifact.status == 200
    end

    def login_url(callback)
      "#{Rails.configuration.intake[:authentication_login_url]}#{callback}"
    end

    def access_code_mapping_url(access_code)
      authentication_base_url = Rails.configuration.intake[:authentication_base_url]
      "#{authentication_base_url}/authn/token?accessCode=#{access_code}"
    end

    def token_validation_url(token)
      "#{Rails.configuration.intake[:authentication_base_url]}/authn/validate?token=#{token}"
    end

  end
end
