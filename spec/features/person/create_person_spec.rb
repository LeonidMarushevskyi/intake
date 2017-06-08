# frozen_string_literal: true

require 'rails_helper'

feature 'Create Person' do
  scenario 'via the create person link on the home page' do
    person = FactoryGirl.create(
      :person,
      date_of_birth: '05/29/1990',
      first_name: 'Homer',
      gender: 'male',
      last_name: 'Simpson',
      middle_name: 'Jay',
      ssn: '123-23-1234',
      name_suffix: 'esq',
      languages: %w[English Farsi],
      races: [
        { race: 'Asian', race_detail: 'Chinese' },
        { race: 'Black or African American' }
      ],
      ethnicity: {
        hispanic_latino_origin: 'Yes',
        ethnicity_detail: 'Mexican'
      },
      phone_numbers: []
    )

    visit new_person_path

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
    select 'Chinese'
    find('label', text: 'Black or African American').click
    find('label', text: 'Yes').click
    select 'Mexican'

    stub_request(:post, host_url(ExternalRoutes.intake_api_people_path))
      .with(body: person.to_json(except: :id))
      .and_return(body: person.to_json,
                  status: 201,
                  headers: { 'Content-Type' => 'application/json' })
    stub_request(:get, host_url(ExternalRoutes.intake_api_person_path(person.id)))
      .and_return(body: person.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

    click_button 'Save'

    expect(
      a_request(
        :post, host_url(ExternalRoutes.intake_api_people_path)
      ).with(body: person.to_json(except: :id))
    ).to have_been_made

    expect(page).to have_current_path(person_path(person.id))
    within '.card-header' do
      expect(page).to have_content('Basic Demographics Card')
    end
    expect(page).to_not have_content('Save')
  end
end
