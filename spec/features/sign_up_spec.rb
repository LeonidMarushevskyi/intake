require 'rails_helper'

feature 'sign up' do
  scenario 'user signs up' do
    visit root_path
    click_link 'Sign up'
    expect(page).to have_content 'First name'
    expect(page).to have_content 'Last name'
    expect(page).to have_content 'Email'
    expect(page).to have_content 'Password'
    expect(page).to have_content 'Password confirmation'

    fill_in 'First name', with: 'Ella'
    fill_in 'Last name', with: 'Phant'
    fill_in 'Email', with: 'badpuns@example.com'
    fill_in 'Password', with: 'Password123'
    fill_in 'Password confirmation', with: 'Password123'
    click_button 'Sign up'
  end
end
