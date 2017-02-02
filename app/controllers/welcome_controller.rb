# frozen_string_literal: true

# Welcome Controller is responsible for managing user
# navigating the landing page.
class WelcomeController < ApplicationController # :nodoc:
  before_action :authenticate_user, if: :authentication_enabled?

  def index
  end

  private

  def authenticate_user
    unless session[:security_token]
      if security_token.present? && valid_security_token?(security_token)
        session[:security_token] = security_token
      else
        redirect_to(login_url(request.original_url))
      end
    end
  end

  def security_token
    params[:token]
  end

  def valid_security_token?(token)
    Faraday.get(token_validation_url(token)).status == 200
  end

  def login_url(callback)
    "#{ENV.fetch('AUTHENTICATION_URL')}/authn/login?callback=#{callback}"
  end

  def token_validation_url(token)
    "#{ENV.fetch('AUTHENTICATION_URL')}/authn/validate?token=#{token}"
  end

  def authentication_enabled?
    Feature.active?(:release_one) && Feature.active?(:authentication)
  end
end
