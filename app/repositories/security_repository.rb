# frozen_string_literal: true

# SecurityRepository is responsible for managing calls
# to the security API
class SecurityRepository
  def self.token_valid?(token)
    return unless token.present?
    auth_artifact = Faraday.get(token_validation_url(token))
    auth_artifact.status == 200 && auth_artifact.body
  end

  def self.login_url(callback)
    "#{Rails.configuration.intake[:authentication_login_url]}#{callback}"
  end

  def self.token_validation_url(token)
    "#{Rails.configuration.intake[:authentication_base_url]}/authn/validate?token=#{token}"
  end
end
