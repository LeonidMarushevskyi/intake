# frozen_string_literal: true

require 'rails_helper'

feature 'System codes' do
  scenario 'system codes are fetch once per page load' do
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
      .and_return(json_body([].to_json, status: 200))
    stub_request(:post, intake_api_url(ExternalRoutes.intake_api_screenings_path))
      .and_return(json_body([].to_json, status: 200))
    stub_request(:get, ferb_api_url(ExternalRoutes.ferb_api_lov_path))
      .and_return(json_body([].to_json, status: 200))
    visit root_path
    click_button 'Start Screening'
    expect(a_request(:get, ferb_api_url(ExternalRoutes.ferb_api_lov_path))).to have_been_made.once
  end
end
