# frozen_string_literal: true

# SecurityRepository is responsible for managing calls
# to the security API
class SecurityRepository
  def self.token_valid?(token)
    token.present? && Faraday.get(token_validation_url(token)).status == 200
  end

  def self.login_url(callback)
    "#{Rails.configuration.intake[:authentication_login_url]}#{callback}"
  end

  def self.token_validation_url(token)
    "#{Rails.configuration.intake[:authentication_base_url]}/authn/validate?token=#{token}"
  end
end
