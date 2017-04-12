# frozen_string_literal: true

# Screening Controller handles all service request for
# the creation and modification of screening objects.
class ScreeningsController < ApplicationController # :nodoc:
  before_action :authenticate_user, if: :authentication_enabled?

  def edit
    render :show
  end

  def show
    render :show
  end
end
