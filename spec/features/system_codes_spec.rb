# frozen_string_literal: true

require 'rails_helper'

feature 'System codes' do
  scenario 'system codes are fetch once per page load' do
    stub_request(:get, ferb_api_url(ExternalRoutes.ferb_api_lov_path)).and_return(status: 200)
    visit root_path
    click_link 'Start Screening'
    expect(a_request(:get, ferb_api_url(ExternalRoutes.ferb_api_lov_path))).to have_been_made.once
  end
end
