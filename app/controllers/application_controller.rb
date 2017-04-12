# frozen_string_literal: true

require 'gulp_assets'

# CA Intake Application Controller.
class ApplicationController < ActionController::Base # :nodoc:
  include GulpAssets::Helper
  include Pundit
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  helper_method :gulp_asset_path

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
