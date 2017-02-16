# frozen_string_literal: true

# Style guide Controller handles rendering the styles
# and UX patterns used for the CA Intake project
class StyleGuideController < ApplicationController # :nodoc:
  layout 'style_guide'
  PAGES = %w(
    forms
    tables
    colors
    typography
    borders
    buttons
    alerts
    navigation
    cards
  ).freeze

  def index; end

  def show
    render "/style_guide/show/#{sanitize_page_name(params[:id])}"
  end

  private

  def sanitize_page_name(page_name)
    PAGES.dup.delete(page_name)
  end
end
