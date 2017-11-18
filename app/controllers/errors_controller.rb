# frozen_string_literal: true

# Errors Controller to handle errors
class ErrorsController < ApplicationController
  def forbidden
    @dashboard_url = Rails.application.config.intake[:dashboard_url]
    render status: :forbidden
  end

  def not_found
    @dashboard_url = Rails.application.config.intake[:dashboard_url]
    render status: 404
  end

  def server_error
    render status: 500
  end
end
