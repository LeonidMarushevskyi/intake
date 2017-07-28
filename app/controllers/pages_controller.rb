# frozen_string_literal: true

# Pages Controller handles all static page presentation.
class PagesController < ApplicationController
  include HighVoltage::StaticPage
  before_action :authenticate_user, if: :authentication_enabled?
end
