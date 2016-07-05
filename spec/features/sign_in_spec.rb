require 'rails_helper'

feature 'sign in' do
  scenario 'user requests forgotten password' do
    visit root_path
    click_link 'Forgot your password?'
    fill_in 'Email', with: 'badpuns@example.com'
    click_button 'Send me reset password instructions'
  end

  scenario 'user signs in' do
    user = FactoryGirl.create(:user)
    visit root_path
    fill_in 'Email', with: user.email
    fill_in 'Password', with: 'Password123'
    click_button 'Log in'
    expect(current_path).to eq root_path
  end
end
