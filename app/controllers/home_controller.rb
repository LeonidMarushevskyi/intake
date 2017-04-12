# frozen_string_literal: true

# Home Controller is responsible for managing user
# navigating the landing page.
class HomeController < ApplicationController # :nodoc:
  before_action :authenticate_user, if: :authentication_enabled?
  def index; end
end
