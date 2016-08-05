# frozen_string_literal: true
require 'gulp_assets'
class ApplicationController < ActionController::Base
  include GulpAssets::Helper
  include Pundit
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  helper_method :gulp_asset_path
end
