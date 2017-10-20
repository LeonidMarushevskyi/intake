# frozen_string_literal: true

# Errors Controller to handle errors
class ErrorsController < ApplicationController
  layout false
  def not_found
    render status: 404
  end
end
