# frozen_string_literal: true

# Home Controller is responsible for managing user
# navigating the landing page.
class HomeController < ApplicationController # :nodoc:
  before_action :authenticate_user, if: :authentication_enabled?

  def index; end

  private

  def authenticate_user
    return if session[:security_token] && set_api_header
    if SecurityRepository.token_valid?(security_token)
      session[:security_token] = security_token
      set_api_header
    else
      redirect_to SecurityRepository.login_url(request.original_url)
    end
  end

  def set_api_header
    ::API.intake_api_connection.headers['Authorization'] = session[:security_token]
  end

  def security_token
    params[:token]
  end

  def authentication_enabled?
    Feature.active?(:authentication)
  end
end
