require 'rails_helper'

feature "Create Referral" do
  scenario "via create referral link" do
    visit root_path

    click_link "Create Referral"

    expect(page.text).to match(/Referral #([0-9a-zA-Z].*)/)
  end
end
