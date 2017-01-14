# frozen_string_literal: true
require 'rails_helper'

feature 'Create Person' do
  scenario 'via the create person link on the home page' do
    person = FactoryGirl.create(
      :person,
      date_of_birth: '05/29/1990',
      first_name: 'Homer',
      gender: 'male',
      id: nil,
      last_name: 'Simpson',
      middle_name: 'Jay',
      ssn: '123-23-1234',
      name_suffix: 'esq',
      languages: %w(English Farsi),
      races: [
        { race: 'Asian' },
        { race: 'Black or African American' }
      ]
    )

    visit root_path

    click_link 'Create Person'
    fill_in 'First Name', with: 'Homer'
    fill_in 'Middle Name', with: 'Jay'
    fill_in 'Last Name', with: 'Simpson'
    select 'Esq', from: 'Suffix'
    select 'Male', from: 'Gender'
    fill_in_react_select 'Language(s)', with: 'English'
    fill_in_react_select 'Language(s)', with: 'Farsi'
    fill_in 'Date of birth', with: '05/29/1990'
    fill_in 'Social security number', with: '123-23-1234'
    find('label', text: 'Asian').click
    find('label', text: 'Black or African American').click

    stub_request(:post, api_people_path)
      .with(body: person.to_json)
      .and_return(body: person.as_json.merge(id: '1').to_json,
                  status: 201,
                  headers: { 'Content-Type' => 'application/json' })
    stub_request(:get, api_person_path('1'))
      .and_return(body: person.as_json.merge(id: '1').to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

    click_button 'Save'

    expect(a_request(:post, api_people_path).with(body: person.to_json)).to have_been_made

    expect(page).to have_current_path(person_path('1'))
    within '.card-header' do
      expect(page).to have_content('BASIC DEMOGRAPHICS CARD')
    end
    expect(page).to_not have_content('Save')
  end
end
