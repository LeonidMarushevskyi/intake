# frozen_string_literal: true

# Errors Controller to handle errors
class ErrorsController < ApplicationController
  def not_found
    @dashboard_url = Rails.application.config.intake[:dashboard_url]
    render status: 404
  end
end
