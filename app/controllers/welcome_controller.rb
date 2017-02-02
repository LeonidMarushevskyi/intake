# frozen_string_literal: true

# Welcome Controller is responsible for managing user
# navigating the landing page.
class WelcomeController < ApplicationController # :nodoc:
  before_action :authenticate_user, if: ->() { Feature.active?(:release_one) }

  def index
  end

  private

  def authenticate_user
    unless session[:security_token]
      if security_token.present?
        if valid_security_token?(security_token)
          session[:security_token] = security_token
        else
          redirect_to(authentication_url)
        end
      else
        redirect_to(authentication_url)
      end
    end
  end

  def security_token
    params[:token]
  end

  def authentication_url
    "#{ENV.fetch('AUTHENTICATION_URL')}/authn/login?callback=#{request.original_url}"
  end

  def valid_security_token?(token)
    Faraday.get("#{ENV.fetch('AUTHENTICATION_URL')}/authn/validate?token=#{token}").status == 200
  end
end
