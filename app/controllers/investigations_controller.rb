# frozen_string_literal: true

# Investigation Controller handles all service request for
# the creation and modification of investigation objects.
class InvestigationsController < ApplicationController # :nodoc:
  before_action :authenticate_user, if: :authentication_enabled?

  def show
    render :show
  end
end
