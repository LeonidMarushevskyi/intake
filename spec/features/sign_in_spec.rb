require 'rails_helper'

feature 'sign in' do
  scenario 'user requests forgotten password' do
    visit root_path
    click_link 'Forgot your password?'
    fill_in 'Email', with: 'badpuns@example.com'
    click_button 'Send me reset password instructions'
  end
end
