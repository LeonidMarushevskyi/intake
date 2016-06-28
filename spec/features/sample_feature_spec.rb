require 'rails_helper'

feature 'Capybara feature spec' do
  scenario 'has a working feature test' do
    visit 'http://google.com'

    expect(page).to have_content 'Gmail'
  end
end
